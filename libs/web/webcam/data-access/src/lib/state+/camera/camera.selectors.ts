import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromCamera from './camera.reducer';

export const selectCameraState = createFeatureSelector<fromCamera.ICameraState>(
  fromCamera.cameraFeatureKey
);

export const selectCameras = createSelector(
  selectCameraState,
  (state) => state.cameras
);

export const selectCameraMicrophones = createSelector(
  selectCameraState,
  (state) => state.microphones
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
  ({ authorization, camera, resolution, isAuthorized, microphone }) => ({
    canUseCamera: authorization.canUseCamera,
    canUseMicrophone: authorization.canUseMicrophone,
    deviceId: camera?.deviceId,
    microphoneId: microphone?.deviceId,
    isAuthorized,
    resolution,
  })
);

export const selectCameraAuthorizations = createSelector(
  selectCameraState,
  ({ authorization, isAuthorized }) => ({
    canUseCamera: authorization.canUseCamera,
    canUseMicrophone: authorization.canUseMicrophone,
    isAuthorized,
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
