import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromCamera from './camera.reducer';

export const selectCameraState = createFeatureSelector<fromCamera.ICameraState>(
  fromCamera.cameraFeatureKey
);

export const selectCameras = createSelector(
  selectCameraState,
  (state) => state.cameras
);

export const selectCamera = createSelector(
  selectCameraState,
  (state) => state.camera
);

export const selectCameraLoading = createSelector(
  selectCameraState,
  (state) => state.loading
);

export const selectCameraIsAuthorized = createSelector(
  selectCameraState,
  (state) => state.isAuthorized
);

export const selectCameraPersistance = createSelector(
  selectCameraState,
  ({ tracking, camera, resolution, isAuthorized }) => ({
    tracking,
    camera,
    isAuthorized,
    resolution,
  })
);

export const selectCameraStreaming = createSelector(
  selectCameraState,
  ({ streaming }) => streaming
);

export const selectCameraError = createSelector(
  selectCameraState,
  (state) => state.error
);
