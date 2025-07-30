import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { REC_ENV } from '@ever-co/shared-service';
import { API_PREFIX } from '@ever-co/shared-utils';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const env = inject(REC_ENV);
  const baseURL = env.apiUrl;
  if (baseURL && req.url.startsWith(API_PREFIX)) {
    const url = baseURL.concat(req.url);
    req = req.clone({ url });
  }
  return next(req);
};
