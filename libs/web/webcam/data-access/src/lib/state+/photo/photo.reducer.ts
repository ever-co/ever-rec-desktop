import { createFeature, createReducer, on } from '@ngrx/store';
import { photoActions } from './photo.actions';
import { IPhoto } from '@ever-co/shared-utils';

export const photoFeatureKey = 'photo';

export interface IPhotoState {
  photos: IPhoto[];
  photo: IPhoto | null;
  saving: boolean;
  loading: boolean;
  error: string | null;
}

export const initialPhotoState: IPhotoState = {
  photos: [],
  photo: null,
  saving: false,
  loading: false,
  error: null,
};

export const reducer = createReducer(
  initialPhotoState,
  on(photoActions.loadPhotos, (state) => state)
);

export const photoFeature = createFeature({
  name: photoFeatureKey,
  reducer,
});
