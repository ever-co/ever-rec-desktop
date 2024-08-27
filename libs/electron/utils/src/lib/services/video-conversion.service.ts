import {
  Channel,
  IChunkService,
  ILoggable,
  ILogger,
  IScreenshot,
  IScreenshotService,
  IVideo,
  IVideoConfig,
  IVideoService,
} from '@ever-capture/shared-utils';
import { ipcMain } from 'electron';
import { join } from 'path';
import { Worker } from 'worker_threads';
import { ISplitterStrategy } from '../interfaces/splitter-strategy.interface';
import { getWindowSize } from '../window-size';
import { FileManager } from './files/file-manager';
import { WorkerFactory } from './worker-factory.service';
import { WorkerHandler } from './worker-handler.service';

export class VideoConversionService implements ILoggable {
  private completedWorkers = 0;
  private batchVideo: { index: number; path: string }[] = [];
  private chunks: IVideo[] = [];

  constructor(
    private event: Electron.IpcMainEvent,
    private screenshots: IScreenshot[],
    private config: IVideoConfig,
    private splitter: ISplitterStrategy,
    private workerFactory: typeof WorkerFactory,
    private fileManager: typeof FileManager,
    private channel: typeof Channel,
    public logger: ILogger,
    private videoService: IVideoService,
    private screenshotService: IScreenshotService,
    private chunkService: IChunkService
  ) {}

  async convert() {
    this.logger.info('Start converting video...');

    if (this.config.resolution.toLowerCase() === 'auto') {
      const { width = 1920, height = 1080 } = getWindowSize();
      this.config.resolution = `${width}:${height}`;
    }

    const screenshotIds = this.screenshots.map(({ id }) => id);

    const chunkExist = await this.videoService.getVideoByCriteria({
      screenshotIds,
      videoMetadata: {
        codec: this.config.codec,
        frameRate: this.config.frameRate,
        resolution: this.config.resolution,
        batch: this.config.batch,
      },
    });

    const chunkSize = chunkExist?.count ?? 0;

    if (chunkExist && chunkSize === screenshotIds.length) {
      this.logger.info(`Last checkpoint reused...`);
      this.logger.info(`Finale video output pathname: ${chunkExist.pathname}`);
      this.event.reply(this.channel.SCREESHOTS_CONVERTED, {
        ...chunkExist,
        screenshots: this.screenshots,
      });
      return;
    }

    if (chunkExist && chunkSize !== screenshotIds.length) {
      const chunkScreenshotIds = new Set(chunkExist.screenshotIds);
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
            const chunk = await this.videoService.save({
              pathname: this.fileManager.encodePath(String(message)),
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
      this.event.reply(this.channel.CANCEL_CONVERSION);
    });
  }

  private handleWorkerCompletion(
    index: number,
    path: string,
    totalBatches: number
  ) {
    this.batchVideo.push({ index, path });
    this.completedWorkers++;

    if (this.completedWorkers === totalBatches) {
      this.logger.info(`Process images to video batch finished...`);
      this.combineVideos();
    }
  }

  private async combineVideos() {
    const finalOutputPath = this.fileManager.createFilePathSync(
      'videos',
      `output-${Date.now()}.mp4`
    );
    const batchVideoPaths = this.batchVideo
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
      async (idx, message) => {
        try {
          this.logger.info(`Processing final batch [${idx}]...`);
          const { frameRate, resolution, codec, batch } = this.config;
          const screenshotIds = this.screenshots.map(({ id }) => id);
          const chunkScreenshotIds = this.chunks
            .flatMap((chunk) => chunk?.screenshots?.map(({ id }) => id) || [])
            .filter((id) => id != null);
          const uniqueScreenshotIds = [
            ...new Set([...chunkScreenshotIds, ...screenshotIds]),
          ];
          const video = await this.videoService.save({
            pathname: this.fileManager.encodePath(String(message)),
            duration: uniqueScreenshotIds.length / frameRate,
            resolution,
            frameRate,
            codec,
            batch,
            chunkIds: this.chunks.map(({ id }) => id)
          });

          const screenshots =
            await this.screenshotService.findAllWithMetadata();

          this.logger.info(`Final video output pathname: ${message}`);
          this.event.reply(this.channel.SCREESHOTS_CONVERTED, {
            ...video,
            screenshots,
          });
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

  private getBatchOutputPath(batchIndex: number): string {
    this.logger.info(`Creating batch file at index ${batchIndex}`);
    const filePath = this.fileManager.createFilePathSync(
      'videos',
      `batch-${batchIndex}-${Date.now()}.mp4`
    );
    this.logger.info(`Batch file path: ${filePath}`);
    return filePath;
  }
}
