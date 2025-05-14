import { ITimeLog, IHeatMapDataPoint } from '@ever-co/shared-utils';

export interface DataProcessingStrategy {
  processData(logs: ITimeLog[] | null): IHeatMapDataPoint[];
  getXAxisLabel(): string;
  getYAxisLabel(): string;
}
