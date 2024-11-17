import { Injectable } from '@angular/core';
import { ElectronService } from '@ever-co/electron-data-access';
import {
  Channel,
  IActivityStateDistribution,
  IAggregatedProductivity,
  IDailyStatistics,
  IHourlyDistribution,
  IRange,
  IWorkPatternAnalysis,
} from '@ever-co/shared-utils';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  constructor(private electronService: ElectronService) {}

  /**
   * Get activity state distribution for a given date range
   */
  public getActivityStateDistribution(
    range: IRange
  ): Observable<IActivityStateDistribution> {
    return from(
      this.electronService.invoke<IRange, IActivityStateDistribution>(
        Channel.REQUEST_ACTIVITIES_DISTRIBUTION,
        range
      )
    );
  }

  /**
   * Get daily activity statistics for a given date range
   */
  public getDailyStatistics(range: IRange): Observable<IDailyStatistics> {
    return from(
      this.electronService.invoke<IRange, IDailyStatistics>(
        Channel.REQUEST_ACTIVITIES_STATISTICS,
        range
      )
    );
  }

  /**
   * Get hourly activity distribution for a specific date
   */
  public getHourlyActivityDistribution(
    date: Date
  ): Observable<IHourlyDistribution> {
    return from(
      this.electronService.invoke<Date, IHourlyDistribution>(
        Channel.REQUEST_ACTIVITIES_HOURLY_DISTRIBUTION,
        date
      )
    );
  }

  /**
   * Get productivity trends with specified interval
   */
  public getProductivityTrends(
    range: IRange,
    interval: 'daily' | 'weekly' | 'monthly' = 'daily'
  ): Observable<IAggregatedProductivity> {
    return from(
      this.electronService.invoke<
        {
          range: IRange;
          interval?: 'daily' | 'weekly' | 'monthly';
        },
        IAggregatedProductivity
      >(Channel.REQUEST_ACTIVITIES_TRENDS, {
        range,
        interval,
      })
    );
  }

  /**
   * Get work pattern analysis for a given date range
   */
  public getWorkPatternAnalysis(
    range: IRange
  ): Observable<IWorkPatternAnalysis> {
    return from(
      this.electronService.invoke<IRange, IWorkPatternAnalysis>(
        Channel.REQUEST_ACTIVITIES_WORK_PATTERN,
        range
      )
    );
  }
}
