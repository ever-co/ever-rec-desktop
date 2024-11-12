import {
  Channel,
  IBatchVideo,
  ILoggable,
  ILogger,
  IScreenshot,
  ITimelineService,
  IVideo,
  IVideoConfig,
  IVideoService,
} from '@ever-co/shared-utils';
import { ipcMain } from 'electron';
import { join } from 'path';
import { In } from 'typeorm';
import { Worker } from 'worker_threads';
import { ISplitterStrategy } from '../interfaces/splitter-strategy.interface';
import { getWindowSize } from '../window-size';
import { FileManager } from './files/file-manager';
import { WorkerFactory } from './worker-factory.service';
import { WorkerHandler } from './worker-handler.service';

export class VideoConversionService implements ILoggable {
  private completedWorkers = 0;
  private batchVideo: IBatchVideo[] = [];
  private chunks: IVideo[] = [];

  constructor(
    private event: Electron.IpcMainEvent,
    private screenshots: IScreenshot[],
    private config: IVideoConfig & { timeLogId: string | undefined },
    private splitter: ISplitterStrategy,
    private workerFactory: typeof WorkerFactory,
    private fileManager: typeof FileManager,
    private channel: typeof Channel,
    public logger: ILogger,
    private videoService: IVideoService,
    private timelineService: ITimelineService
  ) {}

  /**
   * Start converting screenshots to a video. This function will split the list
   * of screenshots into batches and create a worker for each batch. Each worker
   * will convert the screenshots in the batch to a video and save it to the
   * database. The final video will be created by combining all the videos from
   * the batches.
   *
   * If the video already exists, it will be reused.
   *
   * If an error occurs during the conversion process, an error event will be
   * emitted.
   *
   * If the conversion process is canceled, a cancel event will be emitted.
   *
   * @returns {Promise<void>}.
   */
  public async convert(): Promise<void> {
    this.logger.info('Start converting video...');

    const optimized = !!this.config?.optimized;

    if (this.config.resolution.toLowerCase() === 'auto') {
      const { width = 1920, height = 1080 } = getWindowSize();
      this.config.resolution = `${width}:${height}`;
    }

    const screenshotIds = this.screenshots.map(({ id }) => id);
    const chunkExist = await this.videoService.findOne({
      where: {
        screenshots: { id: In(screenshotIds) },
        metadata: {
          codec: this.config.codec,
          frameRate: this.config.frameRate,
          resolution: this.config.resolution,
          batch: this.config.batch,
        },
      },
      relations: ['screenshots', 'screenshots.metadata', 'chunks', 'metadata'],
      order: {
        screenshots: {
          createdAt: 'ASC',
        },
      },
    });

    const chunkSize = chunkExist?.screenshots?.length ?? 0;

    if (chunkExist && chunkSize === screenshotIds.length && optimized) {
      this.logger.info(`Last checkpoint reused...`);
      this.logger.info(`Finale video output pathname: ${chunkExist.pathname}`);
      this.event.reply(this.channel.SCREESHOTS_CONVERTED, chunkExist);
      return;
    }

    if (chunkExist && chunkSize !== screenshotIds.length && optimized) {
      const { screenshots: chunkScreenshots = [] } = chunkExist;
      const chunkScreenshotIds = new Set(chunkScreenshots.map(({ id }) => id));
      this.logger.info(`Last checkpoint reused...`);
      this.chunks.push(chunkExist);
      this.batchVideo.push({
        index: -1,
        path: this.fileManager.decodePath(chunkExist.pathname),
      });
      this.screenshots = this.screenshots.filter(
        ({ id }) => !chunkScreenshotIds.has(id)
      );
    }

    this.logger.info(`Processing ${this.screenshots.length} frames`);

    const filePathnames = this.fileManager.getFilesByPathnames(
      this.screenshots.map(({ pathname }) => pathname)
    );
    const batches = this.splitter.split(
      filePathnames,
      this.config.batch || 100
    );
    const workers: Worker[] = [];
    this.config.duration = this.config.duration / filePathnames.length;

    this.logger.info(`Process [${batches.length}] batches...`);

    batches.forEach(async (batch, index) => {
      const chunkExist = await this.videoService.findOne({
        where: {
          screenshots: { pathname: In(batch) },
          metadata: {
            codec: this.config.codec,
            frameRate: this.config.frameRate,
            resolution: this.config.resolution,
            batch: this.config.batch,
          },
        },
        relations: [
          'screenshots',
          'screenshots.metadata',
          'chunks',
          'metadata',
        ],
        order: {
          screenshots: {
            createdAt: 'ASC',
          },
        },
      });

      const chunkSize = chunkExist?.screenshots?.length ?? 0;

      if (chunkExist && chunkSize === batch.length && optimized) {
        this.logger.info(`Last checkpoint reused...`);
        this.logger.info(`batch video output pathname: ${chunkExist.pathname}`);
        this.chunks.push(chunkExist);
        this.handleWorkerCompletion(
          index,
          this.fileManager.decodePath(chunkExist.pathname),
          workers.length
        );
        return;
      }

      if (chunkExist && chunkSize !== batch.length && optimized) {
        const { screenshots: chunkScreenshots = [] } = chunkExist;
        const chunkScreenshotPathnames = new Set(
          chunkScreenshots.map(({ pathname }) => pathname)
        );
        this.logger.info(`Last batch checkpoint reused...`);
        this.chunks.push(chunkExist);
        this.batchVideo.push({
          index: -1,
          path: this.fileManager.decodePath(chunkExist.pathname),
        });
        batch = batch.filter(
          (pathname) => !chunkScreenshotPathnames.has(pathname)
        );
      }

      const workerPath = join(
        __dirname,
        'assets',
        'workers',
        'convert-screenshots-to-video.worker.js'
      );
      const outputPath = this.getBatchOutputPath(index);
      const worker = this.workerFactory.createWorker(workerPath, {
        filePathnames: batch,
        config: this.config,
        outputPath,
      });
      workers.push(worker);

      this.logger.info(`Process images to video batch [${index}] ...`);

      new WorkerHandler(
        worker,
        index,
        this.event,
        this.channel,
        async (idx, message) => {
          try {
            this.logger.info(`Batch [${idx}] proceed...`);
            const pathname = this.fileManager.encodePath(String(message));
            const size = await this.fileManager.fileSize(pathname);

            const chunk = await this.videoService.save({
              pathname,
              size,
              timeLogId: this.config?.timeLogId,
              duration: batch.length / this.config.frameRate,
              resolution: this.config.resolution,
              frameRate: this.config.frameRate,
              codec: this.config.codec,
              batch: this.config.batch,
              screenshotIds: this.screenshots
                .map(({ id }) => id)
                .slice(this.config.batch * idx, this.config.batch * (idx + 1)),
            });
            this.chunks.push(chunk);
            this.handleWorkerCompletion(idx, String(message), workers.length);
            this.logger.info(`Chunk [${chunk.id}] saved...`);
          } catch (error) {
            this.logger.error(String(error) || 'An error occurred');
            this.event.reply(
              this.channel.GENERATION_ERROR,
              error || 'An error occurred'
            );
          }
        },
        (error) => {
          this.logger.error(error || 'An error occurred');
          this.event.reply(
            this.channel.GENERATION_ERROR,
            error || 'An error occurred'
          );
        },
        this.logger
      );

      worker.postMessage({ command: 'start' });
    });

    ipcMain.on(this.channel.CANCEL_GENERATING, () => {
      workers.forEach((worker) => worker.terminate());
      this.logger.warn('End Generating...');
    });
  }

  /**
   * Handles the completion of a worker.
   * @param index - The index of the completed worker.
   * @param path - The path of the generated video.
   * @param totalBatches - The total number of batches.
   */
  private handleWorkerCompletion(
    index: number,
    path: string,
    totalBatches: number
  ) {
    this.batchVideo.push({ index, path });
    this.completedWorkers++;

    if (this.completedWorkers === totalBatches) {
      this.logger.info(`Process images to video batch finished...`);
      this.combineVideos(this.batchVideo, this.chunks);
    }
  }

  /**
   * Combine the generated video batches into a single final video.
   * @param batchVideo - The array of batch video objects.
   * @param chunks - The array of chunk objects.
   * @returns A promise that resolves when the video combining is complete.
   */
  public async combineVideos(
    batchVideo: IBatchVideo[],
    chunks: IVideo[],
    isTimeline = false
  ): Promise<void> {
    const finalOutputPath = this.fileManager.createFilePathSync(
      'videos',
      `output-${Date.now()}.mp4`
    );
    const batchVideoPaths = batchVideo
      .sort((a, b) => a.index - b.index)
      .map((batch) => batch.path);
    const workerPath = join(
      __dirname,
      'assets',
      'workers',
      'combine-videos.worker.js'
    );
    const worker = this.workerFactory.createWorker(workerPath, {
      batchVideoPaths,
      finalOutputPath,
    });

    this.logger.info(`Start combine ${batchVideoPaths.length} videos...`);

    worker.postMessage({ command: 'start' });

    new WorkerHandler(
      worker,
      -1, // no specific index for combine operation
      this.event,
      this.channel,
      async (idx, message, metadata) => {
        try {
          this.logger.info(`Processing final batch [${idx}]...`);
          const { frameRate, resolution, codec, batch, timeLogId } =
            this.config;
          const screenshotIds = this.screenshots.map(({ id }) => id);
          const chunkScreenshotIds = chunks
            .flatMap((chunk) => chunk?.screenshots?.map(({ id }) => id) || [])
            .filter((id) => id != null);
          const uniqueScreenshotIds = [
            ...new Set([...chunkScreenshotIds, ...screenshotIds]),
          ];
          const pathname = this.fileManager.encodePath(String(message));
          const size = await this.fileManager.fileSize(pathname);
          const duration =
            metadata?.totalDuration || uniqueScreenshotIds.length / frameRate;
          const { id } = await this.videoService.save({
            pathname,
            timeLogId,
            size,
            duration,
            resolution,
            frameRate,
            codec,
            batch,
            chunkIds: chunks.map(({ id }) => id),
            screenshotIds: uniqueScreenshotIds,
          });

          const video = await this.videoService.findOne({
            where: { id },
            relations: ['metadata'],
          });

          if (isTimeline) {
            await this.timelineService.save({ videoId: id, timeLogId });
          }

          this.logger.info(`Final video output pathname: ${message}`);
          this.event.reply(this.channel.SCREESHOTS_CONVERTED, video);
        } catch (error) {
          const errorMessage =
            String(error) || 'An error occurred while combining the video';
          this.logger.error(errorMessage);
          this.event.reply(this.channel.GENERATION_ERROR, errorMessage);
        }
      },
      (error) => {
        this.logger.error(error || 'An Error Occurred while video combination');
        this.event.reply(
          this.channel.GENERATION_ERROR,
          error || 'An Error Occurred while video combination'
        );
      },
      this.logger
    );
  }

  /**
   * Generates a file path for a video batch output.
   *
   * The path is constructed using a directory named 'videos' and a filename
   * that includes the batch index and the current timestamp to ensure
   * uniqueness.
   *
   * @param {number} batchIndex - The index of the video batch.
   * @returns {string} The generated file path for the batch output.
   */
  private getBatchOutputPath(batchIndex: number): string {
    return this.fileManager.createFilePathSync(
      'videos',
      `batch-${batchIndex}-${Date.now()}.mp4`
    );
  }
}
