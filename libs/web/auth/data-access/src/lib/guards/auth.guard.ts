import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { defer, from, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { selectAuthState } from '../state+/auth.selector';
import { REC_ENV } from '@ever-co/shared-service';
import { IEnvironment } from '@ever-co/shared-utils';

function isSessionValid(expiresAt: string | null): boolean {
  if (!expiresAt) return false;
  return new Date(expiresAt).getTime() > Date.now();
}

export const authGuard: CanActivateFn = (_, state) => {
  const store = inject(Store);
  const router = inject(Router);
  const environment = inject<IEnvironment>(REC_ENV);

  if (environment.isPlugin) {
    return of(true);
  }

  return defer(() =>
    store.select(selectAuthState).pipe(
      take(1),
      map(({ user, expiresAt }) => !!user && isSessionValid(expiresAt)),
      switchMap((isValid) => {
        if (isValid) return of(true);
        return from(router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } })).pipe(map(() => false));
      }),
    ),
  );
};
