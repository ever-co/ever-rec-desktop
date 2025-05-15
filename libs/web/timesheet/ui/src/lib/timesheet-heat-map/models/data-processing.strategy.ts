import { ITimeLog, IHeatMapDataPoint } from '@ever-co/shared-utils';
import { Observable } from 'rxjs';

export interface DataProcessingStrategy {
  processData(logs: ITimeLog[] | null): Observable<IHeatMapDataPoint[]>;
  getXAxisLabel(): string;
  getYAxisLabel(): string;
}

export interface DataProcessingFactory {
  createStrategy(): DataProcessingStrategy;
}
