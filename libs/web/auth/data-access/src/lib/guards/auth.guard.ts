import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { selectAuthState, selectUser } from '../state+/auth.selector';
import { map } from 'rxjs';
import { Store } from '@ngrx/store';

export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectAuthState).pipe(
    map(({ user, expiresIn }) => {
      if (!user) {
        router.navigate(['/', 'auth', 'login']);
        return false;
      }
      return true;
    }),
  );
};
