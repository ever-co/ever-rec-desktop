import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { TimelineEffects } from './+state/timeline.effects';
import { timelineFeature } from './+state/timeline.reducer';

export function provideTimelineDataAccess(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideState(timelineFeature),
    provideEffects(TimelineEffects),
  ]);
}
