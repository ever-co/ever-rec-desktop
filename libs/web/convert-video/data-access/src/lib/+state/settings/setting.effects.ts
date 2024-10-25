import { Injectable } from '@angular/core';
import { LocalStorageService } from '@ever-co/shared-service';
import { IVideoConfig } from '@ever-co/shared-utils';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';
import { settingActions } from './setting.actions';

@Injectable()
export class SettingEffects {
  private key = '_video_config';

  loadSettings$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(settingActions.load),
      concatMap(() =>
        this.localStorageService.getItem<IVideoConfig>(this.key).pipe(
          map((videoConfig) => settingActions.loadSuccess({ videoConfig })),
          catchError((error) => of(settingActions.failure({ error })))
        )
      )
    );
  });

  updateSettings$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(settingActions.update),
      concatMap(({ videoConfig }) =>
        this.localStorageService
          .setItem<IVideoConfig>(this.key, videoConfig)
          .pipe(
            map(() => settingActions.load()),
            catchError((error) => of(settingActions.failure({ error })))
          )
      )
    );
  });

  constructor(
    private actions$: Actions,
    private readonly localStorageService: LocalStorageService
  ) {}
}
