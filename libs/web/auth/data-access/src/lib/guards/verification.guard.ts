import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { REC_ENV } from '@ever-co/shared-service';
import { IEnvironment } from '@ever-co/shared-utils';
import { Store } from '@ngrx/store';
import { defer, from, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { authActions } from '../state+/auth.action';
import { selectIsVerified } from '../state+/auth.selector';

export const verificationGuard: CanActivateFn = (_, state) => {
  const store = inject(Store);
  const router = inject(Router);
  const environment = inject<IEnvironment>(REC_ENV);

  if (environment.isPlugin) {
    return of(true);
  }

  return defer(() =>
    store.select(selectIsVerified).pipe(
      take(1),
      switchMap((isVerified) => {
        if (isVerified) return of(true);
        store.dispatch(authActions.sendVerificationEmail());
        return from(
          router.navigate(['/auth/verification'], {
            queryParams: { returnUrl: state.url },
            replaceUrl: true,
          }),
        ).pipe(map(() => false));
      }),
    ),
  );
};
