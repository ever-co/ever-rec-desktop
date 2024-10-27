import { APP_INITIALIZER } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  generateVideoActions,
  selectSettingState,
} from '@ever-co/convert-video-data-access';
import { Store } from '@ngrx/store';
import { combineLatest, take, tap } from 'rxjs';
import { screenshotActions } from '../+state/screenshot.actions';
import { selectScreenshotState } from '../+state/screenshot.selectors';
import { ScreenshotElectronService } from '../services/screenshot-electron.service';

export function autoSyncFactory(
  store: Store,
  service: ScreenshotElectronService
): () => Promise<void> {
  return () =>
    new Promise<void>((resolve) => {
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
                store.dispatch(
                  generateVideoActions.autoGenerate({
                    config: videoSettingState.videoConfig,
                  })
                );
              }
            })
          )
          .subscribe();
      });
      resolve();
    });
}

export const autoSyncProvider = {
  provide: APP_INITIALIZER,
  useFactory: autoSyncFactory,
  deps: [Store, ScreenshotElectronService],
  multi: true,
};
