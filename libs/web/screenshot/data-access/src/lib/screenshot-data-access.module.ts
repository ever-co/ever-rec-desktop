import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { ScreenshotEffects } from './+state/screenshot.effects';
import { screenshotFeature } from './+state/screenshot.reducer';

export function provideScreenshotCategoryDataAccess(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideState(screenshotFeature),
    provideEffects([ScreenshotEffects]),
  ]);
}
