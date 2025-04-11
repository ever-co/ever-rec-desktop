import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { WebcamEffects } from './state+/webcam.effects';
import { webcamFeature } from './state+/webcam.reducer';

export function provideWebcamDataAccess(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideEffects(WebcamEffects),
    provideState(webcamFeature),
  ]);
}
