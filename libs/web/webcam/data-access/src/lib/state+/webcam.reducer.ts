import { createFeature, createReducer, on } from '@ngrx/store';
import { WebcamActions } from './webcam.actions';

export const webcamFeatureKey = 'webcam';

export interface IWebcamState {
  webcams: MediaDeviceInfo[];
  selectedWebcam: MediaDeviceInfo | null;
  isAuthorized: boolean;
  tracking: boolean;
  loading: boolean;
  error: string | null;
}

export const initialWebcamState: IWebcamState = {
  webcams: [],
  selectedWebcam: null,
  loading: false,
  isAuthorized: false,
  tracking: false,
  error: null,
};

export const reducer = createReducer(
  initialWebcamState,
  on(WebcamActions.loadWebcams, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(WebcamActions.loadWebcamsSuccess, (state, { webcams }) => ({
    ...state,
    webcams,
    loading: false,
  })),
  on(WebcamActions.loadWebcamsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(WebcamActions.checkWebcamAuthorizationSuccess, (state) => ({
    ...state,
    isAuthorized: true,
  })),
  on(WebcamActions.checkWebcamAuthorizationFailure, (state, { error }) => ({
    ...state,
    isAuthorized: false,
    error,
  })),
  on(WebcamActions.selectWebcamSuccess, (state, { deviceId, tracking }) => ({
    ...state,
    tracking: tracking ?? state.tracking ?? false,
    selectedWebcam:
      state.webcams.find((webcam) => webcam.deviceId === deviceId) ??
      state.selectedWebcam ??
      null,
  })),
  on(WebcamActions.selectWebcamFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);

export const webcamFeature = createFeature({
  name: webcamFeatureKey,
  reducer,
});
