import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { LocalstorageService } from '@ever-co/shared-service';
import { IScreenCaptureConfig } from '@ever-co/shared-utils';
import { of } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';
import { settingScreenCaptureActions } from './setting.actions';

@Injectable()
export class SettingScreenCaptureEffects {
  private key = '_screenCaptureConfiguration';

  loadSettings$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(settingScreenCaptureActions.load),
      concatMap(() =>
        this.localstorageService.getItem<IScreenCaptureConfig>(this.key).pipe(
          map((screenCaptureConfig) => settingScreenCaptureActions.loadSuccess({ screenCaptureConfig })),
          catchError((error) => of(settingScreenCaptureActions.failure({ error })))
        )
      )
    );
  });

  updateSettings$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(settingScreenCaptureActions.update),
      concatMap(({ screenCaptureConfig }) =>
        this.localstorageService
          .setItem<IScreenCaptureConfig>(this.key, screenCaptureConfig)
          .pipe(
            map(() => settingScreenCaptureActions.load()),
            catchError((error) => of(settingScreenCaptureActions.failure({ error })))
          )
      )
    );
  });

  constructor(
    private actions$: Actions,
    private readonly localstorageService: LocalstorageService
  ) {}
}
