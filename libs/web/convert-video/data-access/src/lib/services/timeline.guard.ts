import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectScreenshotState } from '@prototype/web/screenshot/data-access';
import { catchError, map, of } from 'rxjs';

/**
 * A guard function that checks if the user is on the timeline page.
 *
 * @return {CanActivateFn} A function that returns an observable indicating if the user can activate the route.
 * @throws {Error} If the store or router dependencies are not provided.
 */
export const timelineGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  if (!store || !router) {
    throw new Error('Store and Router are required dependencies');
  }

  return store.select(selectScreenshotState).pipe(
    map(({ screenshots }) => {
      if (!screenshots) {
        router.navigate(['/']);
        return false;
      } else {
        return true;
      }
    }),
    catchError((error) => {
      console.error('Error in timelineGuard', error);
      router.navigate(['/']);
      return of(false);
    })
  );
};
