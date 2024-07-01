import { createFeature, createReducer, on } from '@ngrx/store';
import { screenshotActions } from './screenshot.actions';

export const screenshotFeatureKey = 'screenshot';

export interface IScreenshotState {
  capturing: boolean;
  screenshot: string;
  error: string;
}

export const initialState: IScreenshotState = {
  capturing: false,
  screenshot: '',
  error: '',
};

export const reducer = createReducer(
  initialState,
  on(screenshotActions.startCapture, (state) => ({
    ...state,
    capturing: true,
  })),
  on(screenshotActions.stopCapture, (state) => ({
    ...state,
    capturing: false,
  })),
  on(screenshotActions.captureSuccess, (state, { image }) => ({
    ...state,
    screenshot: image,
    error: '',
  })),
  on(screenshotActions.captureFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);

export const screenshotFeature = createFeature({
  name: screenshotFeatureKey,
  reducer,
});
