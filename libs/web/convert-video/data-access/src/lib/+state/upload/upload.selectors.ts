import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromUpload from './upload.reducer';

export const selectUploadState = createFeatureSelector<fromUpload.State>(
  fromUpload.uploadFeatureKey
);
