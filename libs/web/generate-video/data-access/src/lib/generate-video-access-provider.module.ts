import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { GenerateVideoSettingEffects } from './+state/generate-video-setting/generate-video-setting.effects';
import { generateVideoSettingFeature } from './+state/generate-video-setting/generate-video-setting.reducer';
import { GenerateVideoEffects } from './+state/generate-video/generate-video.effects';
import { generateVideoFeature } from './+state/generate-video/generate-video.reducer';

export function provideGenerateVideoDataAccess(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideState(generateVideoSettingFeature),
    provideState(generateVideoFeature),
    provideEffects(GenerateVideoEffects, GenerateVideoSettingEffects),
  ]);
}
