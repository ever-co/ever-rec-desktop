import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { DatePickerService } from '@ever-co/shared-service';
import { timeLogActions } from '@ever-co/timesheet-data-access';
import { of } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';
import { ActivityService } from '../services/activity.service';
import { activityActions } from './activity.actions';

@Injectable()
export class ActivityEffects {
  private readonly actions$ = inject(Actions);

  loadSateDistribution$ = createEffect(() =>
    this.actions$.pipe(
      ofType(activityActions.loadStateDistribution, timeLogActions.tick),
      map((action) =>
        action.type === timeLogActions.tick.type
          ? { ...action, range: this.datePickerService.range() }
          : action
      ),
      concatMap(({ range }) =>
        this.activityService.getActivityStateDistribution(range).pipe(
          concatMap((distribution) => [
            activityActions.loadStateDistributionSuccess({ distribution }),
          ]),
          catchError((error) =>
            of(activityActions.loadStateDistributionFailure({ error }))
          )
        )
      )
    )
  );

  loadWorkPatternAnalysis$ = createEffect(() =>
    this.actions$.pipe(
      ofType(activityActions.loadWorkPatternAnalysis, timeLogActions.tick),
      map((action) =>
        action.type === timeLogActions.tick.type
          ? { ...action, range: this.datePickerService.range() }
          : action
      ),
      concatMap(({ range = this.datePickerService.range() }) =>
        this.activityService.getWorkPatternAnalysis(range).pipe(
          concatMap((analysis) => [
            activityActions.loadWorkPatternAnalysisSuccess({ analysis }),
          ]),
          catchError((error) =>
            of(activityActions.loadWorkPatternAnalysisFailure({ error }))
          )
        )
      )
    )
  );

  loadDailyStatistics$ = createEffect(() =>
    this.actions$.pipe(
      ofType(activityActions.loadDailyStatistics),
      concatMap(({ range }) =>
        this.activityService.getDailyStatistics(range).pipe(
          concatMap((statistics) => [
            activityActions.loadDailyStatisticsSuccess({ statistics }),
          ]),
          catchError((error) =>
            of(activityActions.loadDailyStatisticsFailure({ error }))
          )
        )
      )
    )
  );

  loadProductivityTrends$ = createEffect(() =>
    this.actions$.pipe(
      ofType(activityActions.loadProductivityTrends),
      concatMap(({ range, interval }) =>
        this.activityService.getProductivityTrends(range, interval).pipe(
          concatMap((trends) => [
            activityActions.loadProductivityTrendsSuccess({ trends }),
          ]),
          catchError((error) =>
            of(activityActions.loadProductivityTrendsFailure({ error }))
          )
        )
      )
    )
  );

  loadStateDistributionHourly$ = createEffect(() =>
    this.actions$.pipe(
      ofType(activityActions.loadStateDistributionHourly),
      concatMap(({ date }) =>
        this.activityService.getHourlyActivityDistribution(date).pipe(
          concatMap((hourlyDistribution) => [
            activityActions.loadStateDistributionHourlySuccess({
              hourlyDistribution,
            }),
          ]),
          catchError((error) =>
            of(activityActions.loadStateDistributionHourlyFailure({ error }))
          )
        )
      )
    )
  );

  constructor(
    private readonly activityService: ActivityService,
    private readonly datePickerService: DatePickerService
  ) {}
}
