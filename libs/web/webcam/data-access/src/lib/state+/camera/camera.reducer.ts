import { createFeature, createReducer, on } from '@ngrx/store';
import { cameraActions } from './camera.actions';
import { Resolution } from '@ever-co/shared-utils';

export const cameraFeatureKey = 'webcamera';

export interface ICameraState {
  cameras: MediaDeviceInfo[];
  camera: MediaDeviceInfo | null;
  microphones: MediaDeviceInfo[];
  microphone: MediaDeviceInfo | null;
  resolution: Resolution;
  isAuthorized: boolean;
  tracking: boolean;
  loading: boolean;
  error: string | null;
  streaming: {
    stream: MediaStream | null;
    creating: boolean;
    closing: boolean;
    error: string | null;
  };
}

export const initialCameraState: ICameraState = {
  microphones: [],
  microphone: null,
  cameras: [],
  camera: null,
  resolution: Resolution.MEDIUM,
  loading: false,
  isAuthorized: false,
  tracking: false,
  error: null,
  streaming: {
    stream: null,
    creating: false,
    closing: false,
    error: null,
  },
};

export const reducer = createReducer(
  initialCameraState,
  on(cameraActions.loadCameras, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(cameraActions.loadCamerasSuccess, (state, { cameras, microphones }) => ({
    ...state,
    cameras,
    microphones,
    loading: false,
  })),
  on(cameraActions.loadCamerasFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(cameraActions.checkCameraAuthorizationSuccess, (state) => ({
    ...state,
    isAuthorized: true,
  })),
  on(cameraActions.checkCameraAuthorizationFailure, (state, { error }) => ({
    ...state,
    isAuthorized: false,
    error,
  })),
  on(
    cameraActions.selectCameraSuccess,
    (state, { deviceId, tracking, resolution, microphoneId }) => ({
      ...state,
      resolution: resolution ?? state.resolution ?? Resolution.MEDIUM,
      tracking: tracking ?? state.tracking ?? false,
      microphone:
        (microphoneId
          ? state.microphones.find(
              (microphone) => microphone.deviceId === microphoneId
            )
          : state.microphone) ?? null,
      camera:
        (deviceId
          ? state.cameras.find((camera) => camera.deviceId === deviceId)
          : state.camera) ?? null,
    })
  ),
  on(cameraActions.selectCameraFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(cameraActions.createCameraStream, (state) => ({
    ...state,
    streaming: {
      ...state.streaming,
      creating: true,
    },
  })),
  on(cameraActions.createCameraStreamSuccess, (state, { stream }) => ({
    ...state,
    streaming: {
      ...state.streaming,
      stream,
      creating: false,
    },
  })),
  on(cameraActions.createCameraStreamFailure, (state, { error }) => ({
    ...state,
    streaming: {
      ...state.streaming,
      error,
      creating: false,
    },
  })),
  on(cameraActions.closeCameraStream, (state) => ({
    ...state,
    streaming: {
      ...state.streaming,
      closing: true,
    },
  })),
  on(cameraActions.closeCameraStreamSuccess, (state) => ({
    ...state,
    streaming: {
      ...state.streaming,
      stream: null,
      closing: false,
    },
  })),
  on(cameraActions.closeCameraStreamFailure, (state, { error }) => ({
    ...state,
    streaming: {
      ...state.streaming,
      error,
      closing: false,
    },
  }))
);

export const cameraFeature = createFeature({
  name: cameraFeatureKey,
  reducer,
});
