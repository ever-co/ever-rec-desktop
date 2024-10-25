import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import {
  generateVideoActions,
  videoActions,
} from '@ever-co/convert-video-data-access';
import { screenshotActions } from '@ever-co/screenshot-data-access';
import { LocalStorageService } from '@ever-co/shared-service';
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
        this.localStorageService.getItem<IStorageState>(this.key).pipe(
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
        this.localStorageService
          .setItem<Partial<IStorageState>>(this.key, storage, { merge: true })
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
        videoActions.deleteVideoSuccess
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
    private readonly localStorageService: LocalStorageService,
    private readonly storageElectronService: StorageElectronService
  ) {}
}
