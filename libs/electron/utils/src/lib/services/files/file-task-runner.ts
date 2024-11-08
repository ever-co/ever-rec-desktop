import { app } from 'electron';
import { join } from 'path';
import { Worker } from 'worker_threads';
import { WorkerFactory } from '../worker-factory.service';

export enum TaskWorkerStatus {
  ERROR = 'Error',
  DONE = 'done',
}

export interface ITaskWorkerMessage<T = any> {
  status: TaskWorkerStatus;
  data?: T;
  error?: string;
}

export class FileTaskRunner {
  private _worker: Worker | null = null;
  private _queue: Array<{
    operation: string;
    payload: any;
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
  }> = [];
  private _isProcessing = false;

  private get worker(): Worker {
    if (!this._worker) {
      this._worker = WorkerFactory.createWorker(
        join(__dirname, 'assets', 'workers', 'file-worker.js'),
        { userDataPath: join(app.getPath('userData')) }
      );

      this._worker.on('message', this.handleWorkerMessage.bind(this));
      this._worker.on('error', this.handleWorkerError.bind(this));
    }
    return this._worker;
  }

  private handleWorkerMessage(msg: ITaskWorkerMessage) {
    if (this._queue.length === 0) return;

    const currentTask = this._queue.shift();
    if (!currentTask) return;

    this._isProcessing = false;
    this.processNextTask();

    if (msg.status === TaskWorkerStatus.DONE) {
      currentTask.resolve(msg.data);
    } else {
      currentTask.reject(new Error(msg.error || 'Unknown error'));
    }
  }

  private handleWorkerError(error: Error) {
    console.error('Worker error:', error);

    // Reject all queued tasks
    while (this._queue.length > 0) {
      const task = this._queue.shift();
      if (task) {
        task.reject(error);
      }
    }

    // Reset worker
    this._worker = null;
    this._isProcessing = false;
  }

  private processNextTask() {
    if (this._isProcessing || this._queue.length === 0) return;

    this._isProcessing = true;
    const nextTask = this._queue[0];

    try {
      this.worker.postMessage({
        operation: nextTask.operation,
        payload: nextTask.payload,
      });
    } catch (error) {
      this._isProcessing = false;
      nextTask.reject(error);
      this._queue.shift();
      this.processNextTask();
    }
  }

  public async run<T, U>(operation: string, payload: T): Promise<U> {
    return new Promise((resolve, reject) => {
      this._queue.push({ operation, payload, resolve, reject });
      this.processNextTask();
    });
  }

  // Cleanup method to terminate worker
  public terminate() {
    if (this._worker) {
      this._worker.terminate();
      this._worker = null;
    }
  }
}
