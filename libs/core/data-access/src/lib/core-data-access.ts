import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { apiInterceptor } from './interceptors/api.interceptor';
import { refreshTokenInterceptor } from './interceptors/refresh-token.interceptor';
import { tokenInterceptor } from './interceptors/token.interceptor';

export function provideCoreDataAccess(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideHttpClient(
      withInterceptors([
        tokenInterceptor,
        refreshTokenInterceptor,
        apiInterceptor,
      ]),
    ),
  ]);
}
