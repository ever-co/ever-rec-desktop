import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectToken } from '@ever-co/auth-data-access';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);
  const token = store.select(selectToken);
  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  return next(req);
};
