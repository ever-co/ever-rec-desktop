import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { apiInterceptor, tokenInterceptor } from '@ever-co/core-data-access';
import { refreshTokenInterceptor } from './interceptors/refresh-token.interceptor';

export function provideCoreDataAccess(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideHttpClient(withInterceptors([tokenInterceptor, refreshTokenInterceptor, apiInterceptor]))
  ]);
}
