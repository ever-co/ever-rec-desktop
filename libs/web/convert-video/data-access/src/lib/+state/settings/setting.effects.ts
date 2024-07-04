import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { LocalstorageService } from '@prototype/shared/service';
import { IVideoConfig } from '@prototype/shared/utils';
import { of } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';
import { settingActions } from './setting.actions';

@Injectable()
export class SettingEffects {
  private key = '_videoConfiguration';

  loadSettings$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(settingActions.load),
      concatMap(() =>
        this.localstorageService.getItem<IVideoConfig>(this.key).pipe(
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
        this.localstorageService
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
    private readonly localstorageService: LocalstorageService
  ) {}
}
