import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromPhotoCapture from './photo-capture.reducer';

export const selectPhotoCaptureState =
  createFeatureSelector<fromPhotoCapture.IPhotoCaptureState>(
    fromPhotoCapture.photoCaptureFeatureKey
  );

export const selectPhotoCaptureSaving = createSelector(
  selectPhotoCaptureState,
  (state) => state.saving
);
