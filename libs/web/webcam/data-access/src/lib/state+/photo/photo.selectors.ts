import { createFeatureSelector } from '@ngrx/store';
import * as fromPhoto from './photo.reducer';

export const selectPhotoState = createFeatureSelector<fromPhoto.IPhotoState>(
  fromPhoto.photoFeatureKey
);
