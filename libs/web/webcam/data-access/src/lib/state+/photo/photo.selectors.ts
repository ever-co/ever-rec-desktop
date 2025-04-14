import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromPhoto from './photo.reducer';

export const selectPhotoState = createFeatureSelector<fromPhoto.IPhotoState>(
  fromPhoto.photoFeatureKey
);

export const selectPhotoSaving = createSelector(
  selectPhotoState,
  (state) => state.saving
);
