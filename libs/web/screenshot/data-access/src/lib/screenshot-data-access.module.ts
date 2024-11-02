import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { ScreenshotEffects } from './+state/screenshot.effects';
import { screenshotFeature } from './+state/screenshot.reducer';
import { SettingScreenCaptureEffects } from './+state/settings/setting.effects';
import { settingScreenCaptureFeature } from './+state/settings/setting.reducer';

export function provideScreenshotDataAccess(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideState(screenshotFeature),
    provideEffects([ScreenshotEffects]),
    provideState(settingScreenCaptureFeature),
    provideEffects([SettingScreenCaptureEffects]),
  ]);
}
