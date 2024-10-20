import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { LocalstorageService } from '@ever-co/shared-service';
import { of } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';
import { settingStorageActions } from './storage-setting.actions';
import { IStorageState } from './storage-setting.reducer';

@Injectable()
export class SettingStorageEffects {
  private key = '_storageRetention';

  loadSettings$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(settingStorageActions.load),
      concatMap(() =>
        this.localstorageService
          .getItem<IStorageState['retention']>(this.key)
          .pipe(
            map((retention) =>
              settingStorageActions.loadSuccess({ retention })
            ),
            catchError((error) => of(settingStorageActions.failure({ error })))
          )
      )
    );
  });

  updateSettings$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(settingStorageActions.update),
      concatMap(({ retention }) =>
        this.localstorageService
          .setItem<IStorageState['retention']>(this.key, retention)
          .pipe(
            map(() => settingStorageActions.load()),
            catchError((error) => of(settingStorageActions.failure({ error })))
          )
      )
    );
  });

  constructor(
    private actions$: Actions,
    private readonly localstorageService: LocalstorageService
  ) {}
}
