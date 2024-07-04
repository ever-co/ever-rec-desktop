import { Worker } from 'worker_threads';

export class WorkerFactory {
  static createWorker(workerPath: string, workerData: any): Worker {
    return new Worker(workerPath, { workerData });
  }
}
