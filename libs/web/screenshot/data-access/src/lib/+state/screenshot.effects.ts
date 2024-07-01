import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { ElectronService } from '@prototype/electron/data-access';
import { of } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { screenshotActions } from './screenshot.actions';

@Injectable()
export class ScreenshotEffects {
  private electronService = inject(ElectronService);

  constructor(private actions$: Actions) {}

  captureScreen$ = createEffect(() =>
    this.actions$.pipe(
      ofType(screenshotActions.startCapture),
      mergeMap((action) => {
        return new Promise((resolve) => {
          this.electronService.captureScreen(action.delay);
          this.electronService.onScreenshotCaptured((image) => {
            resolve(screenshotActions.captureSuccess({ image }));
          });
        });
      }),
      catchError((error) => of(screenshotActions.captureFailure({ error })))
    )
  );
}
