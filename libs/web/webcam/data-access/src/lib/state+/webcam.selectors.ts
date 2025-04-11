import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromWebcam from './webcam.reducer';

export const selectWebcamState = createFeatureSelector<fromWebcam.IWebcamState>(
  fromWebcam.webcamFeatureKey
);

export const selectCameras = createSelector(
  selectWebcamState,
  (state) => state.webcams
);

export const selectSelectedCamera = createSelector(
  selectWebcamState,
  (state) => state.selectedWebcam
);

export const selectCameraLoading = createSelector(
  selectWebcamState,
  (state) => state.loading
);

export const selectCameraIsAuthorized = createSelector(
  selectWebcamState,
  (state) => state.isAuthorized
);

export const selectCameraPersistance = createSelector(
  selectWebcamState,
  ({ tracking, selectedWebcam, isAuthorized }) => ({
    tracking,
    selectedWebcam,
    isAuthorized,
  })
);

export const selectCameraError = createSelector(
  selectWebcamState,
  (state) => state.error
);
