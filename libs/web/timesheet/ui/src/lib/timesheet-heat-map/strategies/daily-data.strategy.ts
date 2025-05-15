import { DataWrapperProcessor } from '../decorators/data-wrapper.processor';
import { DailyDataProcessor } from './workers/processors/daily-data.processor';

export class DailyDataStrategy extends DataWrapperProcessor {
  constructor() {
    super(new DailyDataProcessor());
  }
  public getXAxisLabel(): string {
    return 'Hour of Day';
  }

  public getYAxisLabel(): string {
    return 'Date';
  }
}
