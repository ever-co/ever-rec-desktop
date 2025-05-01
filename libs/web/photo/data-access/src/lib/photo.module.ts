import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { PhotoEffects } from './+state/photo.effects';
import { photoFeature } from './+state/photo.reducer';

export function providePhotoDataAccess(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideEffects(PhotoEffects),
    provideState(photoFeature),
  ]);
}
