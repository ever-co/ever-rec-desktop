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
  on(photoActions.loadPhotos, (state) => ({
    ...state,
    loading: true,
  })),
  on(photoActions.loadPhotosSuccess, (state, { photos }) => ({
    ...state,
    photos,
  })),
  on(photoActions.loadPhotosFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(photoActions.savePhoto, (state) => ({
    ...state,
    saving: true,
  })),
  on(photoActions.savePhotoSuccess, (state, { photo }) => ({
    ...state,
    saving: false,
    photos: [...state.photos, photo],
    photo,
  })),
  on(photoActions.savePhotoFailure, (state, { error }) => ({
    ...state,
    saving: false,
    error,
  }))
);

export const photoFeature = createFeature({
  name: photoFeatureKey,
  reducer,
});
