import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { of } from 'rxjs';
import { catchError, concatMap } from 'rxjs/operators';
import { ActivityService } from '../services/activity.service';
import { activityActions } from './activity.actions';

@Injectable()
export class ActivityEffects {
  loadSateDistribution$ = createEffect(() =>
    this.actions$.pipe(
      ofType(activityActions.loadStateDistribution),
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
      ofType(activityActions.loadWorkPatternAnalysis),
      concatMap(({ range }) =>
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
    private actions$: Actions,
    private readonly activityService: ActivityService
  ) {}
}
