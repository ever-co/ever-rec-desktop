import { IPhoto } from '@ever-co/shared-utils';
import { createFeature, createReducer, on } from '@ngrx/store';
import { photoCaptureActions } from './photo-capture.actions';

export const photoCaptureFeatureKey = 'photoCapture';

export interface IPhotoCaptureState {
  photo: IPhoto | null;
  saving: boolean;
  capturing: boolean;
  error: string | null;
}

export const initialPhotoCaptureState: IPhotoCaptureState = {
  photo: null,
  saving: false,
  capturing: false,
  error: null,
};

export const reducer = createReducer(
  initialPhotoCaptureState,

  on(photoCaptureActions.savePhoto, (state) => ({
    ...state,
    saving: true,
  })),

  on(photoCaptureActions.savePhotoSuccess, (state) => ({
    ...state,
    saving: false,
  })),

  on(photoCaptureActions.savePhotoFailure, (state, { error }) => ({
    ...state,
    saving: false,
    error,
  })),

  on(photoCaptureActions.startTrackingSuccess, (state) => ({
    ...state,
    capturing: true,
  })),

  on(photoCaptureActions.stopTrackingSuccess, (state) => ({
    ...state,
    capturing: false,
  })),

  on(
    photoCaptureActions.stopTrackingFailure,
    photoCaptureActions.startTrackingFailure,
    (state, { error }) => ({
      ...state,
      capturing: false,
      error,
    })
  )
);

export const photoCaptureFeature = createFeature({
  name: photoCaptureFeatureKey,
  reducer,
});
