import { createFeatureSelector } from '@ngrx/store';
import * as fromUpload from './upload.reducer';

export const selectUploadState = createFeatureSelector<fromUpload.UploadState>(
  fromUpload.uploadFeatureKey
);
