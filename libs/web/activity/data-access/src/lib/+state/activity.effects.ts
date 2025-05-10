import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { timeLogActions } from '@ever-co/timesheet-data-access';
import { of } from 'rxjs';
import { catchError, concatMap, map, withLatestFrom } from 'rxjs/operators';
import { ActivityService } from '../services/activity.service';
import { activityActions } from './activity.actions';
import { getDateRangeInterval } from '@ever-co/shared-utils';
import { Store } from '@ngrx/store';
import { selectDateRange } from '@ever-co/date-picker-data-access';

@Injectable()
export class ActivityEffects {
  private readonly actions$ = inject(Actions);

  loadSateDistribution$ = createEffect(() =>
    this.actions$.pipe(
      ofType(activityActions.loadStateDistribution, timeLogActions.tick),
      withLatestFrom(this.store.select(selectDateRange)),
      map(([action, range]) =>
        action.type === timeLogActions.tick.type
          ? { ...action, range }
          : { ...action, range: action.range ?? range },
      ),
      concatMap(({ range }) =>
        this.activityService.getActivityStateDistribution(range).pipe(
          concatMap((distribution) => [
            activityActions.loadStateDistributionSuccess({ distribution }),
          ]),
          catchError((error) =>
            of(activityActions.loadStateDistributionFailure({ error })),
          ),
        ),
      ),
    ),
  );

  loadWorkPatternAnalysis$ = createEffect(() =>
    this.actions$.pipe(
      ofType(activityActions.loadWorkPatternAnalysis, timeLogActions.tick),
      withLatestFrom(this.store.select(selectDateRange)),
      map(([action, range]) =>
        action.type === timeLogActions.tick.type
          ? { ...action, range }
          : { ...action, range: action.range ?? range },
      ),
      concatMap(({ range }) =>
        this.activityService.getWorkPatternAnalysis(range).pipe(
          concatMap((analysis) => [
            activityActions.loadWorkPatternAnalysisSuccess({ analysis }),
          ]),
          catchError((error) =>
            of(activityActions.loadWorkPatternAnalysisFailure({ error })),
          ),
        ),
      ),
    ),
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
            of(activityActions.loadDailyStatisticsFailure({ error })),
          ),
        ),
      ),
    ),
  );

  loadProductivityTrends$ = createEffect(() =>
    this.actions$.pipe(
      ofType(activityActions.loadProductivityTrends),
      concatMap(({ range }) =>
        this.activityService
          .getProductivityTrends(range, getDateRangeInterval(range))
          .pipe(
            concatMap((trends) => [
              activityActions.loadProductivityTrendsSuccess({ trends }),
            ]),
            catchError((error) =>
              of(activityActions.loadProductivityTrendsFailure({ error })),
            ),
          ),
      ),
    ),
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
            of(activityActions.loadStateDistributionHourlyFailure({ error })),
          ),
        ),
      ),
    ),
  );

  constructor(
    private readonly activityService: ActivityService,
    private readonly store: Store,
  ) {}
}
