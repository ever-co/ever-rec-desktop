import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { ActivityEffects } from './+state/activity.effects';
import { activityFeature } from './+state/activity.reducer';

export function provideActivityDataAccess(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideState(activityFeature),
    provideEffects(ActivityEffects),
  ]);
}
