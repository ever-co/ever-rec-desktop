import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromPhotoCapture from './photo-capture.reducer';

export const selectPhotoState =
  createFeatureSelector<fromPhotoCapture.IPhotoCaptureState>(
    fromPhotoCapture.photoCaptureFeatureKey
  );

export const selectPhotoSaving = createSelector(
  selectPhotoState,
  (state) => state.saving
);
