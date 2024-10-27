import { Channel, ILoggable, ILogger } from '@ever-co/shared-utils';
import { Worker } from 'worker_threads';

export class WorkerHandler implements ILoggable {
  constructor(
    private worker: Worker,
    private index: number,
    private event: Electron.IpcMainEvent,
    private channel: typeof Channel,
    private onComplete: (index: number, message: string | number) => void,
    private onError: (error: string) => void,
    public logger: ILogger
  ) {
    this.initializeWorker();
  }

  private initializeWorker() {
    this.worker.on(
      'message',
      (evt: { status: string; message: string | number }) => {
        this.logger.info(`Worker ${this.index} send message:`, evt);
        if (evt.status === 'progress') {
          this.event.reply(this.channel.CONVERSION_IN_PROGRESS, evt.message);
        }
        if (evt.status === 'done') {
          this.logger.info(`Worker ${this.index} finished successfully`);
          this.onComplete(this.index, evt.message);
        }
        if (evt.status === 'error') {
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
}
