import { APP_INITIALIZER } from '@angular/core';
import {
  generateVideoActions,
  selectSettingState,
} from '@ever-co/convert-video-data-access';
import {
  screenshotActions,
  ScreenshotElectronService,
  selectScreenshotState,
  selectSettingScreenCaptureState,
} from '@ever-co/screenshot-data-access';
import { Store } from '@ngrx/store';
import { combineLatest, filter, take, tap, withLatestFrom } from 'rxjs';
import { AutoSyncService } from '../services/auto-sync.service';

export function autoSyncFactory(
  store: Store,
  service: ScreenshotElectronService,
  serviceAutoSync: AutoSyncService
): () => Promise<void> {
  return async () => {
    serviceAutoSync
      .onAutoStartSync()
      .pipe(
        withLatestFrom(
          store.select(selectScreenshotState),
          store.select(selectSettingState),
          store.select(selectSettingScreenCaptureState)
        ),
        filter(([, state]) => !state.capturing),
        tap(([, , videoSettingState, screenCaptureState]) => {
          store.dispatch(
            screenshotActions.startCapture(
              screenCaptureState.screenCaptureConfig
            )
          );
          store.dispatch(
            generateVideoActions.autoGenerate({
              config: videoSettingState.videoConfig,
            })
          );
        })
      )
      .subscribe();

    serviceAutoSync
      .onAutoStopSync()
      .pipe(
        withLatestFrom(store.select(selectScreenshotState)),
        filter(([, state]) => state.capturing),
        tap(() => store.dispatch(screenshotActions.stopCapture()))
      )
      .subscribe();

    await new Promise<void>((resolve) => {
      service.onScreenshotCaptured((screenshot) => {
        combineLatest([
          store.select(selectScreenshotState),
          store.select(selectSettingState),
        ])
          .pipe(
            take(1),
            tap(([screenshotState, videoSettingState]) => {
              if (!screenshotState.capturing && screenshot) {
                store.dispatch(screenshotActions.startCaptureSuccess());
                store.dispatch(
                  screenshotActions.captureSuccess({ screenshot })
                );
                if (videoSettingState.videoConfig.autoGenerate) {
                  store.dispatch(
                    generateVideoActions.autoGenerate({
                      config: videoSettingState.videoConfig,
                    })
                  );
                }
              }
            })
          )
          .subscribe();
      });
      resolve();
    });
  };
}

export const autoSyncProvider = {
  provide: APP_INITIALIZER,
  useFactory: autoSyncFactory,
  deps: [Store, ScreenshotElectronService, AutoSyncService],
  multi: true,
};
