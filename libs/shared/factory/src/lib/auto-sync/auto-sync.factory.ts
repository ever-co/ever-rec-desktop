import { inject, provideAppInitializer } from '@angular/core';
import {
  generateVideoActions,
  selectSettingState,
} from '@ever-co/convert-video-data-access';
import {
  screenshotActions,
  selectScreenshotState,
  selectSettingScreenCaptureState,
} from '@ever-co/screenshot-data-access';
import { Store } from '@ngrx/store';
import { filter, tap, withLatestFrom } from 'rxjs';
import { AutoSyncService } from '../services/auto-sync.service';

export function autoSyncFactory(
  store: Store,
  service: AutoSyncService
): () => void {
  return () => {
    service
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

    service
      .onAutoStopSync()
      .pipe(
        withLatestFrom(store.select(selectScreenshotState)),
        filter(([, state]) => state.capturing),
        tap(() => store.dispatch(screenshotActions.stopCapture()))
      )
      .subscribe();

    service
      .onAutoSync()
      .pipe(
        withLatestFrom(
          store.select(selectScreenshotState),
          store.select(selectSettingState)
        ),
        tap(([screenshot, screenshotState, videoSettingState]) => {
          if (!screenshotState.capturing && screenshot) {
            store.dispatch(screenshotActions.startCaptureSuccess());
            store.dispatch(screenshotActions.captureSuccess({ screenshot }));
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
  };
}

export const autoSyncProvider = provideAppInitializer(() => {
        const initializerFn = (autoSyncFactory)(inject(Store), inject(AutoSyncService));
        return initializerFn();
      });
