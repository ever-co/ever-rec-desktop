import { app } from 'electron';
import { join } from 'path';
import { Worker } from 'worker_threads';
import { WorkerFactory } from '../worker-factory.service';

enum TaskWorkerStatus {
  ERROR = 'Error',
  DONE = 'done',
}

export interface ITaskWorkerMessage<T> {
  status: TaskWorkerStatus;
  data?: T;
  error?: string;
}

export class FileTaskRunner {
  private _worker!: Worker;

  private get worker(): Worker {
    if (!this._worker) {
      this._worker = WorkerFactory.createWorker(
        join(__dirname, 'assets', 'workers', 'file-worker.js'),
        { userDataPath: join(app.getPath('userData')) }
      );
    }
    return this._worker;
  }

  public async run<T, U>(operation: string, payload: T): Promise<U> {
    return new Promise<U>((resolve, reject) => {
      this.worker.once('message', (msg: ITaskWorkerMessage<U>) => {
        if (msg.status === TaskWorkerStatus.DONE) {
          resolve(msg.data as U);
        } else {
          reject(msg.error || 'Unknown error');
        }
      });

      this.worker.postMessage({ operation, payload });
    });
  }
}
