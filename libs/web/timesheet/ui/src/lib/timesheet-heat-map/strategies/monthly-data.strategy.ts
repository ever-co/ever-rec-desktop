import { DataWrapperProcessor } from '../decorators/data-wrapper.processor';
import { MonthlyDataProcessor } from './workers/processors/monthly-data.processor';

export class MonthlyDataStrategy extends DataWrapperProcessor {
  constructor() {
    super(new MonthlyDataProcessor());
  }
  public getXAxisLabel(): string {
    return 'Hour of Day';
  }

  public getYAxisLabel(): string {
    return 'Date';
  }
}
