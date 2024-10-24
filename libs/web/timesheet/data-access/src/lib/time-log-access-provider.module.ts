import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { TimeLogEffects } from './+state/time-log.effects';
import { timeLogFeature } from './+state/time-log.reducer';

export function provideTimeLogDataAccess(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideState(timeLogFeature),
    provideEffects(TimeLogEffects),
  ]);
}
