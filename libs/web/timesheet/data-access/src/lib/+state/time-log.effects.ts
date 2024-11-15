import { Injectable } from '@angular/core';
import { NotificationService } from '@ever-co/notification-data-access';
import { screenshotActions } from '@ever-co/screenshot-data-access';
import { DatePickerService } from '@ever-co/shared-service';
import { IPaginationOptions, ITimeLog } from '@ever-co/shared-utils';
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
        screenshotActions.startCaptureSuccess
      ),
      mergeMap((options) =>
        from(
          this.timeLogElectronService.getLogs(
            options as IPaginationOptions<ITimeLog>
          )
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
      ofType(timeLogActions.tick),
      mergeMap((options) =>
        from(
          this.timeLogElectronService.getLogs(
            options as IPaginationOptions<ITimeLog>
          )
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

  onTick$ = createEffect(() =>
    this.actions$.pipe(
      ofType(screenshotActions.startCaptureSuccess),
      mergeMap(() =>
        this.timeLogElectronService
          .onTick()
          .pipe(map(() => timeLogActions.tick()))
      )
    )
  );

  deleteTimeLog$ = createEffect(() =>
    this.actions$.pipe(
      ofType(timeLogActions.deleteTimeLog),
      mergeMap(({ timeLog }) =>
        from(this.timeLogElectronService.deleteLog(timeLog)).pipe(
          map(() => {
            this.notificationService.show('Time log deleted', 'success');
            return timeLogActions.deleteTimeLogSuccess({ id: timeLog.id });
          }),
          catchError((error) =>
            of(timeLogActions.deleteTimeLogFailure({ error }))
          )
        )
      )
    )
  );

  timeLogStatistics$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        timeLogActions.getTimeLogStatistics,
        timeLogActions.loadTimeLogs,
        screenshotActions.loadScreenshots,
        timeLogActions.tick
      ),
      mergeMap((options) =>
        from(
          this.timeLogElectronService.getLogStatistics({
            start: this.datePickerService.start,
            end: this.datePickerService.end,
            ...options,
          })
        ).pipe(
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

  getTimeLogContext$ = createEffect(() =>
    this.actions$.pipe(
      ofType(timeLogActions.getTimeLogContext),
      mergeMap((action) =>
        from(this.timeLogElectronService.getContext(action)).pipe(
          map((context) =>
            timeLogActions.getTimeLogContextSuccess({ context })
          ),
          catchError((error) => {
            this.notificationService.show('Failed to copy context', 'error');
            return of(timeLogActions.getTimeLogContextFailure({ error }));
          })
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private readonly timeLogElectronService: TimeLogElectronService,
    private readonly datePickerService: DatePickerService,
    private readonly notificationService: NotificationService
  ) {}
}
