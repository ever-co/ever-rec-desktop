import { Injectable } from '@angular/core';
import { ITimeLog } from '@ever-co/shared-utils';
import { DataProcessingStrategy } from '../models/data-processing.strategy';
import { DailyDataStrategy } from '../strategies/daily-data.strategy';
import { HourlyDataStrategy } from '../strategies/hourly-data.strategy';
import { DateService } from './date.service';
import { MonthlyDataStrategy } from '../strategies/monthly-data.strategy';

@Injectable()
export class DataStrategyFactory {
  public createStrategy(logs: ITimeLog[]): DataProcessingStrategy {
    if (!logs || logs.length === 0) {
      return new HourlyDataStrategy();
    }

    const { start, end } = DateService.calculateDateRange(logs);

    if (DateService.isDateRangeMoreThanMonth(start, end)) {
      return new MonthlyDataStrategy();
    }

    if (DateService.isDateRangeMoreThanWeek(start, end)) {
      return new DailyDataStrategy();
    }

    return new HourlyDataStrategy();
  }
}
