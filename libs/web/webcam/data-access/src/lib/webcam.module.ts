import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { AudioRecordingEffects } from './state+/audio-recording/audio-recording.effects';
import { audioRecordingFeature } from './state+/audio-recording/audio-recording.reducer';
import { CameraEffects } from './state+/camera/camera.effects';
import { cameraFeature } from './state+/camera/camera.reducer';
import { PhotoCaptureEffects } from './state+/photo-capture/photo-capture.effects';
import { photoCaptureFeature } from './state+/photo-capture/photo-capture.reducer';

export function provideWebcamDataAccess(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideEffects(CameraEffects, PhotoCaptureEffects, AudioRecordingEffects),
    provideState(cameraFeature),
    provideState(photoCaptureFeature),
    provideState(audioRecordingFeature),
  ]);
}
