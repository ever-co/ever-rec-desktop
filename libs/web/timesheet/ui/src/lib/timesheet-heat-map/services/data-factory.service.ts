import { Inject, Injectable } from '@angular/core';
import { IEnvironment, ITimeLog } from '@ever-co/shared-utils';
import { DailyDataFactory } from '../factories/daily-data.factory';
import { HourlyDataFactory } from '../factories/hourly-data.factory';
import { MonthlyDataFactory } from '../factories/monthly-data.factory';
import {
  DataProcessingFactory,
  DataProcessingStrategy,
} from '../models/data-processing.strategy';
import { DateService } from './date.service';
import { REC_ENV } from '@ever-co/shared-service';

@Injectable({
  providedIn: 'root',
})
export class DataStrategyFactory {
  constructor(@Inject(REC_ENV) private env: IEnvironment) {}

  public createStrategy(logs: ITimeLog[] | null): DataProcessingStrategy {
    let factory: DataProcessingFactory = new HourlyDataFactory(this.env);
    if (!logs || logs.length === 0) {
      return factory.createStrategy();
    }

    const { start, end } = DateService.calculateDateRange(logs);

    if (DateService.isDateRangeMoreThanMonth(start, end)) {
      factory = new MonthlyDataFactory(this.env);
    }

    if (DateService.isDateRangeMoreThanWeek(start, end)) {
      factory = new DailyDataFactory(this.env);
    }

    return factory.createStrategy();
  }
}
