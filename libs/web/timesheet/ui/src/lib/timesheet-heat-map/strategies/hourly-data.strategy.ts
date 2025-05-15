import { DataWrapperProcessor } from '../decorators/data-wrapper.processor';
import { HourlyDataProcessor } from './workers/processors/hourly-data.processor';

export class HourlyDataStrategy extends DataWrapperProcessor {
  constructor() {
    super(new HourlyDataProcessor());
  }
  public getXAxisLabel(): string {
    return 'Date';
  }

  public getYAxisLabel(): string {
    return 'Day of Week';
  }
}
