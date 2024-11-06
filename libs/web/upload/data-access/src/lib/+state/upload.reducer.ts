import { IUpload, UploadType } from '@ever-co/shared-utils';
import { createFeature, createReducer, on } from '@ngrx/store';
import { uploadActions } from './upload.actions';

export const uploadFeatureKey = 'upload';

export interface UploadState {
  config: IUpload;
  error: string;
  uploading: boolean;
  progress: number;
}

export const initialState: UploadState = {
  config: {
    type: UploadType.VIDEO,
    key: '',
    ids: [],
  },
  progress: 0,
  error: '',
  uploading: false,
};

export const reducer = createReducer(
  initialState,
  on(uploadActions.uploadVideo, (state) => ({
    ...state,
    uploading: true,
  })),
  on(uploadActions.uploadVideoSuccess, (state) => ({
    ...state,
    uploading: false,
  })),

  on(uploadActions.onProgress, (state, { progress }) => ({
    ...state,
    progress,
  })),

  on(uploadActions.inProgress, (state, { config }) => ({
    ...state,
    uploading: true,
    config,
  })),

  on(uploadActions.uploadVideoFailure, (state, { error }) => ({
    ...state,
    uploading: false,
    error,
  })),

  on(uploadActions.cancelUpload, (state) => ({
    ...state,
    uploading: false,
  }))
);

export const uploadFeature = createFeature({
  name: uploadFeatureKey,
  reducer,
});
