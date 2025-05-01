import { inject, Injectable } from '@angular/core';
import {
  generateVideoActions,
  videoActions,
} from '@ever-co/convert-video-data-access';
import { screenshotActions } from '@ever-co/screenshot-data-access';
import { SecureLocalStorageService } from '@ever-co/shared-service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { catchError, concatMap, filter, map, mergeMap } from 'rxjs/operators';
import { StorageElectronService } from '../services/storage-electron.service';
import { settingStorageActions } from './storage-setting.actions';
import { IStorageState } from './storage-setting.reducer';
import { audioRecordingActions, photoActions } from '@ever-co/webcam-data-access';
import { audioActions } from '@ever-co/audio-data-access';

@Injectable()
export class SettingStorageEffects {
  private key = '_storage';
  private readonly actions$ = inject(Actions);

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
        screenshotActions.captureSuccess,
        generateVideoActions.progress,
        generateVideoActions.finishSuccess,
        videoActions.deleteVideosSuccess,
        screenshotActions.deleteScreenshotsSuccess,
        screenshotActions.deleteSelectedScreenshotsSuccess,
        photoActions.deletePhotosSuccess,
        photoActions.savePhotoSuccess,
        screenshotActions.purgeSuccess,
        audioActions.deleteAudiosSuccess,
        audioRecordingActions.saveAudioSuccess
      ),
      mergeMap(() =>
        from(this.storageElectronService.getUsedSize()).pipe(
          map((used) => settingStorageActions.update({ used })),
          catchError((error) => of(settingStorageActions.failure({ error })))
        )
      )
    )
  );

  autoDeletion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(generateVideoActions.finish),
      mergeMap(({ video }) =>
        this.localStorageService.getItem<IStorageState>(this.key).pipe(
          filter((state) => !!state?.autoScreenshotDeletion),
          map(() => screenshotActions.autoDeletion({ video })),
          catchError((error) => of(settingStorageActions.failure({ error })))
        )
      )
    )
  );

  constructor(
    private readonly localStorageService: SecureLocalStorageService,
    private readonly storageElectronService: StorageElectronService
  ) {}
}
