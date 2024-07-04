import { Worker } from 'worker_threads';

export class WorkerHandler {
  constructor(
    private worker: Worker,
    private index: number,
    private event: any,
    private channel: any,
    private onComplete: (index: number, message: any) => void,
    private onError: (error: any) => void
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

    this.worker.on('error', (error: any) => {
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
