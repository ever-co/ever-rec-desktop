import { IPhoto, ISelected } from '@ever-co/shared-utils';
import { createFeature, createReducer, on } from '@ngrx/store';
import { photoActions } from './photo.actions';
import { photoCaptureActions } from '@ever-co/webcam-data-access';

export const photoFeatureKey = 'photoCrud';

export interface IPhotoState {
  photos: IPhoto[];
  photo: IPhoto | null;
  selectedPhotos: ISelected<IPhoto>[];
  loading: boolean;
  deleting: boolean;
  hasNext: boolean;
  count: number;
  error: string | null;
}

export const initialPhotoState: IPhotoState = {
  photos: [],
  photo: null,
  hasNext: false,
  selectedPhotos: [],
  count: 0,
  loading: false,
  deleting: false,
  error: null,
};

export const reducer = createReducer(
  initialPhotoState,

  on(photoActions.loadPhotos, (state) => ({
    ...state,
    loading: true,
    error: '',
  })),

  on(photoActions.loadPhotosSuccess, (state, { data, hasNext, count }) => ({
    ...state,
    count,
    hasNext,
    photos: [
      ...new Map(
        [...state.photos, ...data].map((item) => [item.id, item])
      ).values(),
    ],
    loading: false,
    error: '',
  })),

  on(photoActions.loadPhotosFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(photoActions.deletePhotos, (state) => ({
    ...state,
    deleting: true,
    error: '',
  })),

  on(photoActions.deletePhotosSuccess, () => ({
    ...initialPhotoState,
  })),

  on(photoActions.deletePhotosFailure, (state, { error }) => ({
    ...state,
    deleting: false,
    error,
  })),

  on(photoActions.deletePhoto, (state) => ({
    ...state,
    deleting: true,
    error: '',
  })),

  on(photoActions.deletePhotoSuccess, (state, { id }) => ({
    ...state,
    deleting: false,
    count: state.count - 1,
    photos: state.photos.filter((photo) => photo.id !== id),
  })),

  on(photoActions.deletePhotoFailure, (state, { error }) => ({
    ...state,
    deleting: false,
    error,
  })),

  on(photoCaptureActions.savePhotoSuccess, (state, { photo }) => ({
    ...state,
    photos: [...state.photos, photo],
    photo,
  })),

  // Delete selected photos
  on(photoActions.deleteSelectedPhotos, (state) => ({
    ...state,
    deleting: true,
    error: '',
  })),

  on(photoActions.deleteSelectedPhotosSuccess, (state, { photos }) => {
    const photoIdsDeleted = photos.map((photo) => photo.id);

    // Filter out deleted photos
    const updatedPhotos = state.photos.filter(
      (photo) => !photoIdsDeleted.includes(photo.id)
    );

    return {
      ...state,
      photos: updatedPhotos,
      deleting: false,
    };
  }),

  on(photoActions.deleteSelectedPhotosFailure, (state, { error }) => ({
    ...state,
    deleting: false,
    error,
  })),

  // Select Photo
  on(photoActions.selectPhoto, (state, { photo }) => ({
    ...state,
    selectedPhotos: [
      ...new Map(
        [...state.selectedPhotos, photo].map((item) => [item, item])
      ).values(),
    ].filter((photo) => photo.selected),
  })),

  // Unselect Photo
  on(photoActions.unselectPhoto, (state, { photo }) => ({
    ...state,
    selectedPhotos: state.selectedPhotos.filter(
      ({ data }) => photo.data.id !== data.id
    ),
  })),

  // Unselect All Photos
  on(photoActions.unselectAllPhotos, (state) => ({
    ...state,
    deleting: false,
    selectedPhotos: [],
  })),

  // Reset screenshots
  on(photoActions.resetPhotos, (state) => ({
    ...state,
    photos: initialPhotoState.photos,
  })),

  on(photoActions.loadPhoto, (state) => ({
    ...state,
    loading: true,
  })),

  on(photoActions.loadPhotoSuccess, (state, { photo }) => ({
    ...state,
    loading: false,
    photo,
  })),

  on(photoActions.loadPhotoFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(photoActions.deletePhotos, (state) => ({
    ...state,
    deleting: true,
  })),

  on(photoActions.deletePhotosSuccess, () => ({
    ...initialPhotoState,
  })),

  on(photoActions.deletePhotosFailure, (state, { error }) => ({
    ...state,
    deleting: false,
    error,
  }))
);

export const photoFeature = createFeature({
  name: photoFeatureKey,
  reducer,
});
