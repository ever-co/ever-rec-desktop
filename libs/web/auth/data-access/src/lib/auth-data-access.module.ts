import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { AuthEffects } from './state+/auth.effect';
import { authFeature } from './state+/auth.reducer';

export function provideAuthDataAccess(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideState(authFeature),
    provideEffects(AuthEffects),
  ]);
}
