import { Injectable, inject } from '@angular/core';
import { NotificationService } from '@ever-co/notification-data-access';
import { LocalStorageService } from '@ever-co/shared-service';
import {
  IPaginationOptions,
  IScreenshotMetadataStatistic,
} from '@ever-co/shared-utils';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { from, of } from 'rxjs';
import {
  catchError,
  concatMap,
  debounceTime,
  map,
  mergeMap,
} from 'rxjs/operators';
import { ScreenshotElectronService } from '../services/screenshot-electron.service';
import { screenshotActions } from './screenshot.actions';

@Injectable()
export class ScreenshotEffects {
  private electronService = inject(ScreenshotElectronService);
  private readonly actions$ = inject(Actions);
  private readonly KEY = '_history';
  private readonly MAX_HISTORY_ITEMS = 25;

  constructor(
    private readonly notificationService: NotificationService,
    private readonly localStorageService: LocalStorageService
  ) {}

  startCaptureScreen$ = createEffect(() =>
    this.actions$.pipe(
      ofType(screenshotActions.startCapture),
      map((action) => {
        this.electronService.startCapture(action);
        this.notificationService.show('Start capturing screen.', 'success');
        return screenshotActions.startCaptureSuccess();
      }),
      catchError((error) => of(screenshotActions.captureFailure({ error })))
    )
  );

  stopCaptureScreen$ = createEffect(() =>
    this.actions$.pipe(
      ofType(screenshotActions.stopCapture),
      map(() => {
        this.electronService.stopCapture();
        this.notificationService.show('Stop capturing screen.', 'success');
        return screenshotActions.stopCaptureSuccess();
      }),
      catchError((error) => of(screenshotActions.captureFailure({ error })))
    )
  );

  captureScreen$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        screenshotActions.startCaptureSuccess,
        screenshotActions.captureSuccess
      ),
      mergeMap(() => {
        return new Promise<Action<string>>((resolve) => {
          this.electronService.onScreenshotCaptured((screenshot) => {
            resolve(screenshotActions.captureSuccess({ screenshot }));
          });
        });
      }),
      catchError((error) => of(screenshotActions.captureFailure({ error })))
    )
  );

  getAllScreenshots = createEffect(() =>
    this.actions$.pipe(
      ofType(screenshotActions.loadScreenshots),
      mergeMap((options) =>
        from(this.electronService.getAllScreenshots(options)).pipe(
          map((response) => screenshotActions.loadScreenshotsSuccess(response)),
          catchError((error) =>
            of(screenshotActions.loadScreenshotsFailure({ error }))
          )
        )
      )
    )
  );

  deleteAllData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(screenshotActions.deleteScreenshots),
      mergeMap(() =>
        from(this.electronService.deleteAllData()).pipe(
          map(() => {
            this.notificationService.show('All data deleted', 'success');
            return screenshotActions.deleteScreenshotsSuccess();
          }),
          catchError((error) =>
            of(screenshotActions.deleteScreenshotsFailure({ error }))
          )
        )
      )
    )
  );

  deleteScreenshot$ = createEffect(() =>
    this.actions$.pipe(
      ofType(screenshotActions.deleteScreenshot),
      mergeMap((screenshot) =>
        from(this.electronService.deleteScreenshot(screenshot)).pipe(
          map(() => {
            this.notificationService.show('Screenshot deleted', 'success');
            return screenshotActions.deleteScreenshotSuccess(screenshot);
          }),
          catchError((error) =>
            of(screenshotActions.deleteScreenshotFailure({ error }))
          )
        )
      )
    )
  );

  askFor$ = createEffect(() =>
    this.actions$.pipe(
      ofType(screenshotActions.ask),
      debounceTime(500),
      mergeMap((options) =>
        from(this.electronService.askFor(options)).pipe(
          map((response) => screenshotActions.askSuccess(response)),
          catchError((error) => of(screenshotActions.askFailure({ error })))
        )
      )
    )
  );

  getStatistics$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        screenshotActions.getScreenshotsStatistics,
        screenshotActions.loadScreenshots,
        screenshotActions.captureSuccess,
        screenshotActions.deleteScreenshotsSuccess,
        screenshotActions.deleteScreenshotSuccess
      ),
      mergeMap((options) =>
        from(
          this.electronService.getStatistics(
            options as IPaginationOptions<IScreenshotMetadataStatistic>
          )
        ).pipe(
          map(({ hasNext, count, data }) =>
            screenshotActions.getScreenshotsStatisticsSuccess({
              hasNext,
              count,
              data,
            })
          ),
          catchError((error) =>
            of(screenshotActions.getScreenshotsStatisticsFailure({ error }))
          )
        )
      )
    )
  );

  deleteSelectedScreenshots$ = createEffect(() =>
    this.actions$.pipe(
      ofType(screenshotActions.deleteSelectedScreenshots),
      mergeMap(({ screenshots }) =>
        from(this.electronService.deleteSelectedScreenshots(screenshots)).pipe(
          map(() => {
            this.notificationService.show(
              'Selected screenshots deleted',
              'success'
            );
            return screenshotActions.deleteSelectedScreenshotsSuccess({
              screenshots,
            });
          }),
          catchError((error) =>
            of(screenshotActions.deleteSelectedScreenshotsFailure({ error }))
          )
        )
      )
    )
  );

  autoScreenshotDeletion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(screenshotActions.autoDeletion),
      mergeMap(({ video }) =>
        from(
          this.electronService.getAllScreenshots({
            where: {
              video: {
                id: video.id,
              },
            },
            limit: -1,
          })
        ).pipe(
          concatMap(async ({ data }) => {
            await this.electronService.deleteSelectedScreenshots(data);
            return data;
          }),
          map((screenshots) => {
            this.notificationService.show(
              'Screenshots deleted After Video Creation',
              'info'
            );
            return screenshotActions.deleteSelectedScreenshotsSuccess({
              screenshots,
            });
          }),
          catchError((error) =>
            of(screenshotActions.deleteSelectedScreenshotsFailure({ error }))
          )
        )
      )
    )
  );

  // Helper method to handle common error scenarios
  private handleError(error: string) {
    console.error('Screenshot history operation failed:', error);
    return screenshotActions.loadHistoryFailure({ error });
  }

  // Helper method to get current history
  private getHistory() {
    return this.localStorageService.getItem<string[]>(this.KEY).pipe(
      map((history) => history ?? []),
      catchError((error) => {
        console.error('Failed to retrieve history:', error);
        return of([]);
      })
    );
  }

  // Helper method to save history and return success action
  private saveHistory(history: string[]) {
    const trimmedHistory = history.slice(0, this.MAX_HISTORY_ITEMS);
    return this.localStorageService.setItem(this.KEY, trimmedHistory).pipe(
      map(() =>
        screenshotActions.loadHistorySuccess({ history: trimmedHistory })
      ),
      catchError((error) => of(this.handleError(error)))
    );
  }

  addToHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(screenshotActions.addToHistory),
      mergeMap(({ searchQuery }) =>
        this.getHistory().pipe(
          mergeMap((history) => {
            const updatedHistory = [...new Set([searchQuery, ...history])];
            return this.saveHistory(updatedHistory);
          })
        )
      )
    )
  );

  removeFromHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(screenshotActions.removeFromHistory),
      mergeMap(({ searchQuery }) =>
        this.getHistory().pipe(
          mergeMap((history) => {
            const updatedHistory = history.filter((q) => q !== searchQuery);
            return this.saveHistory(updatedHistory);
          })
        )
      )
    )
  );

  loadHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(screenshotActions.loadHistory),
      mergeMap(() =>
        this.getHistory().pipe(
          map((history) => screenshotActions.loadHistorySuccess({ history })),
          catchError((error) => of(this.handleError(error)))
        )
      )
    )
  );

  filterHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(screenshotActions.filterHistory),
      mergeMap(({ searchQuery }) =>
        this.getHistory().pipe(
          map((history) => {
            const filtered = history.filter((q) =>
              q.toLowerCase().includes(searchQuery.toLowerCase())
            );
            return screenshotActions.loadHistorySuccess({
              history: filtered,
            });
          })
        )
      )
    )
  );

  getScreenshotsChartLine$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        screenshotActions.captureSuccess,
        screenshotActions.getScreenshotsChartLine,
        screenshotActions.deleteScreenshotsSuccess,
        screenshotActions.deleteScreenshotsSuccess
      ),
      mergeMap(() =>
        from(this.electronService.getScreenshotsChartLine()).pipe(
          map((dataLine) =>
            screenshotActions.getScreenshotsChartLineSuccess({ dataLine })
          ),
          catchError((error) =>
            of(screenshotActions.getScreenshotsChartLineFailure({ error }))
          )
        )
      )
    )
  );
}
