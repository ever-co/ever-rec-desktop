import { DailyDataProcessor } from '../processors/daily-data.processor';
import { HourlyDataProcessor } from '../processors/hourly-data.processor';
import { MonthlyDataProcessor } from '../processors/monthly-data.processor';
import { DailyDataHandler } from './daily-data.handler';
import { HourlyDataHandler } from './hourly-data.handler';
import { MonthlyDataHandler } from './monthly-data.handler';

export class HandlerFactory {
  public static createHandlers() {
    return [
      new DailyDataHandler(new DailyDataProcessor()),
      new HourlyDataHandler(new HourlyDataProcessor()),
      new MonthlyDataHandler(new MonthlyDataProcessor()),
    ];
  }
}
