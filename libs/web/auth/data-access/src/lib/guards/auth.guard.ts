import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { defer, from, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { selectAuthState } from '../state+/auth.selector';

function isSessionValid(expiresAt: string | null): boolean {
  if (!expiresAt) return false;
  return new Date(expiresAt).getTime() > Date.now();
}

export const authGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return defer(() =>
    store.select(selectAuthState).pipe(
      take(1),
      map(({ user, expiresAt }) => !!user && isSessionValid(expiresAt)),
      switchMap((isValid) => {
        if (isValid) return of(true);
        return from(router.navigate(['/auth/login'])).pipe(map(() => false));
      }),
    ),
  );
};
