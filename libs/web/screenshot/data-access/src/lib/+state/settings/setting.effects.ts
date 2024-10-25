import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { LocalStorageService } from '@ever-co/shared-service';
import { IScreenCaptureConfig } from '@ever-co/shared-utils';
import { of } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';
import { settingScreenCaptureActions } from './setting.actions';

@Injectable()
export class SettingScreenCaptureEffects {
  private key = '_screen_capture_config';

  loadSettings$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(settingScreenCaptureActions.load),
      concatMap(() =>
        this.localStorageService.getItem<IScreenCaptureConfig>(this.key).pipe(
          map((screenCaptureConfig) =>
            settingScreenCaptureActions.loadSuccess({ screenCaptureConfig })
          ),
          catchError((error) =>
            of(settingScreenCaptureActions.failure({ error }))
          )
        )
      )
    );
  });

  updateSettings$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(settingScreenCaptureActions.update),
      concatMap(({ screenCaptureConfig }) =>
        this.localStorageService
          .setItem<IScreenCaptureConfig>(this.key, screenCaptureConfig)
          .pipe(
            map(() => settingScreenCaptureActions.load()),
            catchError((error) =>
              of(settingScreenCaptureActions.failure({ error }))
            )
          )
      )
    );
  });

  constructor(
    private actions$: Actions,
    private readonly localStorageService: LocalStorageService
  ) {}
}
