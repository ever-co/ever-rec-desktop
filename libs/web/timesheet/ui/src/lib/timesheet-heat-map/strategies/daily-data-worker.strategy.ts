import { IHeatMapDataPoint, ITimeLog } from '@ever-co/shared-utils';
import { Observable, of, Subject } from 'rxjs';
import { DataProcessingStrategy } from '../models/data-processing.strategy';
import { MessageType } from './workers/interfaces/data.interface';

export class DailyDataWorkerStrategy implements DataProcessingStrategy {
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
      type: MessageType.PROCESS_DAILY_DATA,
      data: logs,
    });

    return workerSubject.asObservable();
  }

  public getXAxisLabel(): string {
    return 'Hour of Day';
  }

  public getYAxisLabel(): string {
    return 'Date';
  }
}
