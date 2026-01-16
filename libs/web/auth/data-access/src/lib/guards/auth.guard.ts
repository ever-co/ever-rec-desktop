import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { REC_ENV } from '@ever-co/shared-service';
import { IEnvironment } from '@ever-co/shared-utils';
import { Store } from '@ngrx/store';
import { defer, from, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { selectIsAuthenticated } from '../state+/auth.selector';

export const authGuard: CanActivateFn = (_, state) => {
  const store = inject(Store);
  const router = inject(Router);
  const environment = inject<IEnvironment>(REC_ENV);

  if (environment.isPlugin) {
    return of(true);
  }

  return defer(() =>
    store.select(selectIsAuthenticated).pipe(
      take(1),
      switchMap((isAuthenticated) => {
        if (isAuthenticated) return of(true);
        return from(
          router.navigate(['/auth/login'], {
            queryParams: { returnUrl: state.url },
            replaceUrl: true,
          }),
        ).pipe(map(() => false));
      }),
    ),
  );
};
