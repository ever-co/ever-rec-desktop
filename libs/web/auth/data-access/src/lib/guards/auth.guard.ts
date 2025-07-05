import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, tap } from 'rxjs/operators';
import { selectAuthState } from '../state+/auth.selector';

function isSessionValid(expiresAt: string | null): boolean {
  if (!expiresAt) return false;
  const now = Date.now();
  const expiry = new Date(expiresAt).getTime();
  return expiry > now;
}

export const authGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectAuthState).pipe(
    map(({ user, expiresAt }) => {
      const isAuthenticated = !!user && isSessionValid(expiresAt);
      return isAuthenticated;
    }),
    tap((isValid) => {
      if (!isValid) {
        router.navigate(['/', 'auth', 'login']);
      }
    }),
  );
};
