import { IHeatMapDataPoint, ITimeLog } from '@ever-co/shared-utils';
import { Observable, of, Subject } from 'rxjs';
import { DataProcessingStrategy } from '../models/data-processing.strategy';
import { MessageType } from './workers/interfaces/data.interface';

export class MonthlyDataWorkerStrategy implements DataProcessingStrategy {
  private readonly worker: Worker;

  constructor() {
    this.worker = new Worker(
      new URL('workers/heat-map-data.worker', import.meta.url),
      {
        type: 'module',
        name: 'heat-map-worker',
      },
    );
    if (!this.worker) {
      throw new Error("There's an issue with web worker");
    }
  }

  public processData(logs: ITimeLog[]): Observable<IHeatMapDataPoint[]> {
    if (!logs?.length) {
      return of([]);
    }

    const workerSubject = new Subject<IHeatMapDataPoint[]>();

    this.worker.onmessage = ({ data }) => {
      if (data.type === MessageType.PROCESSED) {
        workerSubject.next(data.points);
        workerSubject.complete();
        this.worker.terminate();
      }
    };

    this.worker.postMessage({
      type: MessageType.PROCESS_MONTHLY_DATA,
      data: logs,
    });

    return workerSubject.asObservable();
  }

  getXAxisLabel(): string {
    return 'Date';
  }

  getYAxisLabel(): string {
    return 'Day of Week';
  }
}
