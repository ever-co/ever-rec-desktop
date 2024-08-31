import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { selectScreenshotState } from '@ever-capture/screenshot-data-access';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import { settingActions } from '../+state/settings/setting.actions';
import { selectSettingState } from '../+state/settings/setting.selectors';
import { generateVideoActions } from '../+state/video/generate-video.actions';
import { selectGenerateVideoState } from '../+state/video/generate-video.selectors';

/**
 * A guard function that checks if the user is on the timeline page.
 *
 * @return {CanActivateFn} A function that returns an observable indicating if the user can activate the route.
 */
export const timelineGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  store.dispatch(settingActions.load());

  return store.select(selectScreenshotState).pipe(
    withLatestFrom(store.select(selectGenerateVideoState)),
    switchMap(([screenshotState, videoState]) => {
      const { count, filter } = screenshotState;
      const { video } = videoState;

      if (!count) {
        router.navigate(['/convert']);
        return of(false);
      }

      if (!video.pathname) {
        return store.select(selectSettingState).pipe(
          map(({ videoConfig }) => {
            store.dispatch(
              generateVideoActions.start({
                config: videoConfig,
                filter,
              })
            );
            return true;
          })
        );
      }

      return of(true);
    }),
    catchError((error) => {
      console.error('Error in timelineGuard:', error);
      router.navigate(['/']);
      return of(false);
    })
  );
};
