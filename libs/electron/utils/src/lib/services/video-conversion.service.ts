import { ipcMain } from 'electron';
import { join } from 'path';
import { Worker } from 'worker_threads';
import { FileManager } from '../file-manager';
import { ISplitterStrategy } from '../interfaces/splitter-strategy.interface';
import { WorkerFactory } from './worker-factory.service';
import { WorkerHandler } from './worker-handler.service';

export class VideoConversionService {
  private completedWorkers = 0;
  private batchVideo: { index: number; path: string }[] = [];

  constructor(
    private event: any,
    private screenshots: any[],
    private config: any,
    private splitter: ISplitterStrategy,
    private workerFactory: typeof WorkerFactory,
    private fileManager: typeof FileManager,
    private channel: any
  ) {}

  async convert() {
    const filePathnames = this.fileManager.getFilesByPathnames(
      this.screenshots.map(({ pathname }) => pathname)
    );
    const batches = this.splitter.split(
      filePathnames,
      this.config.batch || 100
    );
    const workers: Worker[] = [];
    this.config.duration = this.config.duration / filePathnames.length;

    batches.forEach((batch, index) => {
      const workerPath = join(
        __dirname,
        'assets',
        'workers',
        'convert-screenshots-to-video.worker.js'
      );
      const worker = this.workerFactory.createWorker(workerPath, {
        filePathnames: batch,
        outputPath: this.getBatchOutputPath(index),
        config: this.config,
      });
      workers.push(worker);

      new WorkerHandler(
        worker,
        index,
        this.event,
        this.channel,
        (idx, message) =>
          this.handleWorkerCompletion(idx, message, workers.length),
        (error) =>
          this.event.reply(
            this.channel.GENERATION_ERROR,
            error.message || 'An error occurred'
          )
      );

      worker.postMessage({ command: 'start' });
    });

    ipcMain.on(this.channel.CANCEL_GENERATING, () => {
      workers.forEach((worker) => worker.terminate());
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
      this.combineVideos();
    }
  }

  private async combineVideos() {
    const finalOutputPath = this.fileManager.createFilePath(
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

    worker.postMessage({ command: 'start' });

    new WorkerHandler(
      worker,
      -1, // no specific index for combine operation
      this.event,
      this.channel,
      (_, message) => {
        this.event.reply(
          this.channel.SCREESHOTS_CONVERTED,
          this.fileManager.encodePath(String(message))
        );
      },
      (error) => {
        this.event.reply(
          this.channel.GENERATION_ERROR,
          'An Error Occurred while video combination'
        );
      }
    );
  }

  private getBatchOutputPath(batchIndex: number): string {
    return this.fileManager.createFilePath(
      'videos',
      `batch-${batchIndex}-${Date.now()}.mp4`
    );
  }
}
