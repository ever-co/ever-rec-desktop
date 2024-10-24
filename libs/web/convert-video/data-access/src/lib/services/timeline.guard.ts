import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { selectScreenshotState } from '@ever-co/screenshot-data-access';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import { generateVideoActions } from '../+state/generate-video/generate-video.actions';
import { selectGenerateVideoState } from '../+state/generate-video/generate-video.selectors';
import { settingActions } from '../+state/settings/setting.actions';
import { selectSettingState } from '../+state/settings/setting.selectors';

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

      if (!video.pathname && count) {
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
