import { Injectable } from '@angular/core';
import { screenshotActions } from '@ever-co/screenshot-data-access';
import { datePickerActions } from '@ever-co/shared-service';
import { IPaginationOptions } from '@ever-co/shared-utils';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { TimeLogElectronService } from '../services/time-log-electron.service';
import { timeLogActions } from './time-log.actions';

@Injectable()
export class TimeLogEffects {
  loadTimeLog$ = createEffect(() =>
    this.actions$.pipe(
      ofType(timeLogActions.loadTimeLog),
      mergeMap((options) => {
        return from(this.timeLogElectronService.getLog(options)).pipe(
          map((timeLog) => timeLogActions.loadTimeLogSuccess({ timeLog })),
          catchError((error) =>
            of(timeLogActions.loadTimeLogFailure({ error }))
          )
        );
      })
    )
  );

  getAllTimeLogs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        timeLogActions.loadTimeLogs,
        screenshotActions.stopCaptureSuccess,
        screenshotActions.startCaptureSuccess,
        datePickerActions.selectRange
      ),
      mergeMap((options) =>
        from(
          this.timeLogElectronService.getLogs(options as IPaginationOptions)
        ).pipe(
          map((response) => timeLogActions.loadTimeLogsSuccess(response)),
          catchError((error) =>
            of(timeLogActions.loadTimeLogsFailure({ error }))
          )
        )
      )
    )
  );

  updateDuration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(screenshotActions.captureSuccess),
      mergeMap((options) =>
        from(
          this.timeLogElectronService.getLogs(options as IPaginationOptions)
        ).pipe(
          map((response) =>
            timeLogActions.updateTimeLogDurationSuccess(response)
          ),
          catchError((error) =>
            of(timeLogActions.loadTimeLogsFailure({ error }))
          )
        )
      )
    )
  );

  deleteTimeLog$ = createEffect(() =>
    this.actions$.pipe(
      ofType(timeLogActions.deleteTimeLog),
      mergeMap(({ timeLog }) =>
        from(this.timeLogElectronService.deleteLog(timeLog)).pipe(
          map(() => timeLogActions.deleteTimeLogSuccess({ id: timeLog.id })),
          catchError((error) =>
            of(timeLogActions.deleteTimeLogFailure({ error }))
          )
        )
      )
    )
  );

  timeLogStatistics$ = createEffect(() =>
    this.actions$.pipe(
      ofType(timeLogActions.getTimeLogStatistics),
      mergeMap((options) =>
        from(this.timeLogElectronService.getLogStatistics(options)).pipe(
          map((response) =>
            timeLogActions.getTimeLogStatisticsSuccess(response)
          ),
          catchError((error) =>
            of(timeLogActions.getTimeLogStatisticsFailure({ error }))
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private readonly timeLogElectronService: TimeLogElectronService
  ) {}
}
