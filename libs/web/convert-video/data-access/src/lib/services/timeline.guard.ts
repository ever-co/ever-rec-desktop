import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectScreenshotState } from '@prototype/web/screenshot/data-access';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
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

  return store.select(selectScreenshotState).pipe(
    withLatestFrom(store.select(selectGenerateVideoState)),
    switchMap(([screenshotState, videoState]) => {
      const { screenshots } = screenshotState;
      const { video } = videoState;

      if (!screenshots.length) {
        router.navigate(['/convert']);
        return of(false);
      }

      if (!video.pathname) {
        return store.select(selectSettingState).pipe(
          map(({ videoConfig }) => {
            store.dispatch(
              generateVideoActions.start({
                screenshotIds: screenshots.map(({ id }) => id),
                config: videoConfig,
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
