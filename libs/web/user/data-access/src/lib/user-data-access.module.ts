import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { UserUpdateEffects } from './+state/user-update.effect';
import { userUpdateFeature } from './+state/user-update.reducer';

export function provideUserDataAccess(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideState(userUpdateFeature),
    provideEffects(UserUpdateEffects),
  ]);
}
