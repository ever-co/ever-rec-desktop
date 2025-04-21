import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { CameraEffects } from './state+/camera/camera.effects';
import { cameraFeature } from './state+/camera/camera.reducer';
import { PhotoEffects } from './state+/photo/photo.effects';
import { photoFeature } from './state+/photo/photo.reducer';
import { AudioEffects } from './state+/audio/audio.effects';
import { audioFeature } from './state+/audio/audio.reducer';

export function provideWebcamDataAccess(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideEffects(CameraEffects, PhotoEffects, AudioEffects),
    provideState(cameraFeature),
    provideState(photoFeature),
    provideState(audioFeature),
  ]);
}
