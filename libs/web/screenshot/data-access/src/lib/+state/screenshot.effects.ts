import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { ElectronService } from '@prototype/electron/data-access';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { screenshotActions } from './screenshot.actions';

@Injectable()
export class ScreenshotEffects {
  private electronService = inject(ElectronService);

  constructor(private actions$: Actions) {}

  startCaptureScreen$ = createEffect(() =>
    this.actions$.pipe(
      ofType(screenshotActions.startCapture),
      map((action) => this.electronService.startCapture(action.delay)),
      catchError((error) => of(screenshotActions.captureFailure({ error })))
    )
  );

  stopCaptureScreen$ = createEffect(() =>
    this.actions$.pipe(
      ofType(screenshotActions.stopCapture),
      map(() => this.electronService.stopCapture()),
      catchError((error) => of(screenshotActions.captureFailure({ error })))
    )
  );

  captureScreen$ = createEffect(() =>
    this.actions$.pipe(
      ofType(screenshotActions.startCapture, screenshotActions.captureSuccess),
      mergeMap(() => {
        return new Promise((resolve) => {
          this.electronService.onScreenshotCaptured((image) => {
            resolve(screenshotActions.captureSuccess({ image }));
          });
        });
      }),
      catchError((error) => of(screenshotActions.captureFailure({ error })))
    )
  );
}
