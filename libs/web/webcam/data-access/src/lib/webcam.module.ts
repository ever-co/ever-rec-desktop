import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { CameraEffects } from './state+/camera/camera.effects';
import { cameraFeature } from './state+/camera/camera.reducer';

export function provideWebcamDataAccess(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideEffects(CameraEffects),
    provideState(cameraFeature),
  ]);
}
