import { Worker } from 'worker_threads';

export class WorkerFactory {
  static createWorker<T>(workerPath: string, workerData?: T): Worker {
    return new Worker(workerPath, { workerData });
  }
}
