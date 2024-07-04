import { Channel } from '@prototype/shared/utils';
import { Worker } from 'worker_threads';

export class WorkerHandler {
  constructor(
    private worker: Worker,
    private index: number,
    private event: Electron.IpcMainEvent,
    private channel: typeof Channel,
    private onComplete: (index: number, message: string | number) => void,
    private onError: (error: string) => void
  ) {
    this.initializeWorker();
  }

  private initializeWorker() {
    this.worker.on(
      'message',
      (evt: { status: string; message: string | number }) => {
        if (evt.status === 'progress') {
          this.event.reply(this.channel.CONVERSION_IN_PROGRESS, evt.message);
        }
        if (evt.status === 'done') {
          this.onComplete(this.index, evt.message);
        }
        if (evt.status === 'error') {
          this.event.reply(this.channel.GENERATION_ERROR, evt.message);
        }
      }
    );

    this.worker.on('error', (error: string) => {
      console.error(`Worker error in batch ${this.index}: ${error}`);
      this.onError(error);
    });

    this.worker.on('exit', (code: number) => {
      console.log(`Worker for batch ${this.index} exited with code ${code}`);
      if (code !== 1) {
        this.event.reply(
          this.channel.GENERATION_ERROR,
          'Worker exited with an error'
        );
      }
      this.worker.terminate();
    });
  }
}
