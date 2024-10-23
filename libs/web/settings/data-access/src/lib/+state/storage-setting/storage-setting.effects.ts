import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { generateVideoActions } from '@ever-co/convert-video-data-access';
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

  getUsedSize$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        settingStorageActions.getUsedSize,
        screenshotActions.deleteScreenshots,
        screenshotActions.captureSuccess,
        generateVideoActions.progress,
        generateVideoActions.finishSuccess,
        generateVideoActions.deleteVideoSuccess,
      ),
      mergeMap(() =>
        from(this.storageElectronService.getUsedSize()).pipe(
          map((used) => settingStorageActions.update({ used })),
          catchError((error) => of(settingStorageActions.failure({ error })))
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
