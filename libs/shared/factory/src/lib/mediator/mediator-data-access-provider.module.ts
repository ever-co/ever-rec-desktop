import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { MediatorEffects } from './state+/mediator.effects';

export function provideMediatorDataAccess(): EnvironmentProviders {
  return makeEnvironmentProviders([provideEffects(MediatorEffects)]);
}
