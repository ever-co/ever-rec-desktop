import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { GenerateVideoEffects } from './+state/video/generate-video.effects';
import { generateVideoFeature } from './+state/video/generate-video.reducer';

export function provideConvertVideoDataAccess(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideState(generateVideoFeature),
    provideEffects(GenerateVideoEffects),
  ]);
}
