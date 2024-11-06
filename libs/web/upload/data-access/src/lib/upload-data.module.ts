import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { UploadEffects } from './+state/upload.effects';
import { uploadFeature } from './+state/upload.reducer';

export function provideUploadDataAccess(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideEffects(UploadEffects),
    provideState(uploadFeature),
  ]);
}
