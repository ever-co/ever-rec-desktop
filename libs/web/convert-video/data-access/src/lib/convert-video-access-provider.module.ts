import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { SettingEffects } from './+state/settings/setting.effects';
import { settingFeature } from './+state/settings/setting.reducer';
import { videoRemoteControlFeature } from './+state/video-remote-control/video-remote-control.reducer';
import { GenerateVideoEffects } from './+state/video/generate-video.effects';
import { generateVideoFeature } from './+state/video/generate-video.reducer';

export function provideConvertVideoDataAccess(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideState(generateVideoFeature),
    provideEffects(GenerateVideoEffects),
    provideState(settingFeature),
    provideEffects(SettingEffects),
    provideState(videoRemoteControlFeature),
  ]);
}
