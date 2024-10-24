import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { GenerateVideoEffects } from './+state/generate-video/generate-video.effects';
import { generateVideoFeature } from './+state/generate-video/generate-video.reducer';
import { SettingEffects } from './+state/settings/setting.effects';
import { settingFeature } from './+state/settings/setting.reducer';
import { videoRemoteControlFeature } from './+state/video-remote-control/video-remote-control.reducer';
import { VideoEffects } from './+state/video/video.effects';
import { videoFeature } from './+state/video/video.reducer';

export function provideConvertVideoDataAccess(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideState(generateVideoFeature),
    provideEffects(GenerateVideoEffects),
    provideState(videoFeature),
    provideEffects(VideoEffects),
    provideState(settingFeature),
    provideEffects(SettingEffects),
    provideState(videoRemoteControlFeature),
  ]);
}
