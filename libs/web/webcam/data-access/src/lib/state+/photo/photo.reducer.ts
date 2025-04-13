import { createFeature, createReducer, on } from '@ngrx/store';
import { PhotoActions } from './photo.actions';
import { IPhoto } from '@ever-co/shared-utils';

export const photoFeatureKey = 'photo';

export interface IPhotoState {
  photos: IPhoto[];
  photo: IPhoto | null;
  saving: boolean;
  error: string | null;
}

export const initialPhotoState: IPhotoState = {
  photos: [],
  photo: null,
  saving: false,
  error: null,
};

export const reducer = createReducer(
  initialPhotoState,
  on(PhotoActions.loadPhotos, (state) => state)
);

export const photoFeature = createFeature({
  name: photoFeatureKey,
  reducer,
});
