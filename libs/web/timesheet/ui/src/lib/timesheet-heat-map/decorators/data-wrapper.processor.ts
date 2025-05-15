import { IHeatMapDataPoint, ITimeLog } from '@ever-co/shared-utils';
import { asapScheduler, Observable, of, Subject } from 'rxjs';
import { DataProcessingStrategy } from '../models/data-processing.strategy';
import { DataProcessor } from '../strategies/workers/interfaces/data.interface';

export abstract class DataWrapperProcessor implements DataProcessingStrategy {
  constructor(private readonly processor: DataProcessor) {}

  public processData(logs: ITimeLog[]): Observable<IHeatMapDataPoint[]> {
    if (!logs?.length) {
      return of([]);
    }
    const processorSubject = new Subject<IHeatMapDataPoint[]>();
    asapScheduler.schedule(() => {
      processorSubject.next(this.processor.execute(logs));
      processorSubject.complete();
    });
    return processorSubject.asObservable();
  }

  public abstract getXAxisLabel(): string;
  public abstract getYAxisLabel(): string;
}
