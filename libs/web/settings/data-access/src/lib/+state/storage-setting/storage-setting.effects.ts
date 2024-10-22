import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { screenshotActions } from '@ever-co/screenshot-data-access';
import { LocalstorageService } from '@ever-co/shared-service';
import { from, of } from 'rxjs';
import { catchError, concatMap, map, mergeMap } from 'rxjs/operators';
import { StorageElectronService } from '../services/storage-electron.service';
import { settingStorageActions } from './storage-setting.actions';
import { IStorageState } from './storage-setting.reducer';

@Injectable()
export class SettingStorageEffects {
  private key = '_storageRetention';

  loadSettings$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(settingStorageActions.load),
      concatMap(() =>
        this.localstorageService.getItem<IStorageState>(this.key).pipe(
          map((storage) => settingStorageActions.loadSuccess(storage)),
          catchError((error) => of(settingStorageActions.failure({ error })))
        )
      )
    );
  });

  updateSettings$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(settingStorageActions.update),
      concatMap((storage) =>
        this.localstorageService
          .setItem<Partial<IStorageState>>(this.key, storage)
          .pipe(
            map(() => settingStorageActions.load()),
            catchError((error) => of(settingStorageActions.failure({ error })))
          )
      )
    );
  });

  getTotalSize$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        settingStorageActions.getTotalSize,
        screenshotActions.deleteScreenshots
      ),
      mergeMap(() =>
        from(this.storageElectronService.getTotalSize()).pipe(
          map((size) => settingStorageActions.update({ size })),
          catchError((error) => {
            console.error('Error fetching total size:', error);
            return of(settingStorageActions.failure({ error }));
          })
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private readonly localstorageService: LocalstorageService,
    private readonly storageElectronService: StorageElectronService
  ) {}
}
