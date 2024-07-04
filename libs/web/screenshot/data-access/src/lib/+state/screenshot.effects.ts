import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { from, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ScreenshotElectronService } from '../services/screenshot-electron.service';
import { screenshotActions } from './screenshot.actions';

@Injectable()
export class ScreenshotEffects {
  private electronService = inject(ScreenshotElectronService);

  constructor(private actions$: Actions) {}

  startCaptureScreen$ = createEffect(() =>
    this.actions$.pipe(
      ofType(screenshotActions.startCapture),
      map((action) => {
        this.electronService.startCapture(action.delay);
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
        return new Promise((resolve) => {
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
      mergeMap(() =>
        from(this.electronService.getAllScreenshots()).pipe(
          map((screenshots) =>
            screenshotActions.loadScreenshotsSuccess({ screenshots })
          ),
          catchError((error) =>
            of(screenshotActions.loadScreenshotsFailure({ error }))
          )
        )
      )
    )
  );
}
