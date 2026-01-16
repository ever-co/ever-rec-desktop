import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectRefreshToken } from '@ever-co/auth-data-access';
import { switchMap, take } from 'rxjs';

export const refreshTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);

  return store.select(selectRefreshToken).pipe(
    take(1),
    switchMap((refreshToken) => {
      const modifiedReq = refreshToken
        ? req.clone({ setHeaders: { 'x-refresh-token': refreshToken } })
        : req;
      return next(modifiedReq);
    })
  );
};
