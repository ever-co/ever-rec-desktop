import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { VideoEffects } from './+state/video.effects';
import { videoFeature } from './+state/video.reducer';

export function provideVideoDataAccess(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideState(videoFeature),
    provideEffects(VideoEffects),
  ]);
}
