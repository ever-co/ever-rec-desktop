import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { AuthService } from './services/auth.service';
import { AuthEffects } from './state+/auth.effect';
import { authFeature } from './state+/auth.reducer';
import { AuthElectronService } from './services/auth-electron.service';

export function provideAuthDataAccess(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideState(authFeature),
    provideEffects(AuthEffects),
    AuthService,
    AuthElectronService
  ]);
}
