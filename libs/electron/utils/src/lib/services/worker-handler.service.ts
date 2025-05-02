import { Channel, ILoggable, ILogger } from '@ever-co/shared-utils';
import { BrowserWindow } from 'electron';
import { Worker } from 'worker_threads';

export class WorkerHandler implements ILoggable {
  constructor(
    private worker: Worker,
    private index: number,
    private event: Electron.IpcMainEvent,
    private channel: typeof Channel,
    private onComplete: (
      index: number,
      message: string | number,
      metadata?: { totalDuration: number }
    ) => void,
    private onError: (error: string) => void,
    public logger: ILogger
  ) {
    this.initializeWorker();
  }

  private initializeWorker() {
    this.worker.on(
      'message',
      (evt: {
        status: string;
        message: string | number;
        totalDuration: number;
      }) => {
        this.logger.info(`Worker ${this.index} send message:`, evt);
        if (evt.status === 'progress') {
          this.window?.setProgressBar(Number(evt.message) / 100);
          this.event.reply(this.channel.CONVERSION_IN_PROGRESS, evt.message);
        }
        if (evt.status === 'done') {
          this.window?.setProgressBar(-1);
          this.logger.info(`Worker ${this.index} finished successfully`);
          this.onComplete(this.index, evt.message, {
            totalDuration: evt.totalDuration,
          });
        }
        if (evt.status === 'error') {
          this.window?.setProgressBar(-1);
          this.logger.info(
            `Worker ${this.index} send error message: ${evt.message}`
          );
          this.event.reply(this.channel.GENERATION_ERROR, evt.message);
        }
      }
    );

    this.worker.on('error', (error: string) => {
      this.logger.error(`Worker error in batch ${this.index}:`, error);
      this.onError(error);
    });

    this.worker.on('exit', (code: number) => {
      this.logger.info(
        `Worker for batch ${this.index} exited with code ${code}`
      );
      if (code !== 1) {
        this.logger.info(
          `Worker ${this.index} send exit error message: Worker exited with an error`
        );
        this.event.reply(
          this.channel.GENERATION_ERROR,
          'Worker exited with an error'
        );
      }
      this.worker.terminate();
    });
  }

  private get window(): BrowserWindow | null {
    return BrowserWindow.fromId(this.event.frameId);
  }
}
