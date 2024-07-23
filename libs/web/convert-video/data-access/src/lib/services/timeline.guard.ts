import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectScreenshotState } from '@prototype/web/screenshot/data-access';
import { map } from 'rxjs';

export const timelineGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectScreenshotState).pipe(
    map(({ screenshots }) => {
      if (screenshots.length > 0) {
        return true;
      } else {
        router.navigate(['/']);
        return false;
      }
    })
  );
};
