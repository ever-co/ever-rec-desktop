import { inject, provideAppInitializer } from '@angular/core';
import {
  generateVideoActions,
  selectGenerateVideoConfig,
} from '@ever-co/generate-video-data-access';
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
  service: AutoSyncService,
): () => void {
  return () => {
    service
      .onAutoStartSync()
      .pipe(
        withLatestFrom(
          store.select(selectScreenshotState),
          store.select(selectGenerateVideoConfig),
          store.select(selectSettingScreenCaptureState),
        ),
        filter(([, state]) => !state.capturing),
        tap(([, , videoConfig, { screenCaptureConfig }]) => {
          store.dispatch(screenshotActions.startCapture(screenCaptureConfig));
          store.dispatch(
            generateVideoActions.autoGenerate({
              config: videoConfig,
            }),
          );
        }),
      )
      .subscribe();

    service
      .onAutoStopSync()
      .pipe(
        withLatestFrom(store.select(selectScreenshotState)),
        filter(([, state]) => state.capturing),
        tap(() => store.dispatch(screenshotActions.stopCapture())),
      )
      .subscribe();

    service
      .onAutoSync()
      .pipe(
        withLatestFrom(
          store.select(selectScreenshotState),
          store.select(selectGenerateVideoConfig),
        ),
        tap(([screenshot, screenshotState, videoConfig]) => {
          if (!screenshotState.capturing && screenshot) {
            store.dispatch(screenshotActions.startCaptureSuccess());
            store.dispatch(screenshotActions.captureSuccess({ screenshot }));
            if (videoConfig.autoGenerate) {
              store.dispatch(
                generateVideoActions.autoGenerate({
                  config: videoConfig,
                }),
              );
            }
          }
        }),
      )
      .subscribe();
  };
}

export const autoSyncProvider = provideAppInitializer(() => {
  const initializerFn = autoSyncFactory(inject(Store), inject(AutoSyncService));
  return initializerFn();
});
