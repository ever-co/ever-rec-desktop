import { createFeature, createReducer, on } from '@ngrx/store';
import { screenshotActions } from './screenshot.actions';

export const screenshotFeatureKey = 'screenshot';

export interface IScreenshotState {
  capturing: boolean;
  screenshots: string[];
  error: string;
}

export const initialState: IScreenshotState = {
  capturing: false,
  screenshots: [],
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
    screenshots: [...state.screenshots, image],
    error: '',
  })),
  on(screenshotActions.captureFailure, (state, { error }) => ({
    ...state,
    capturing: false,
    error,
  }))
);

export const screenshotFeature = createFeature({
  name: screenshotFeatureKey,
  reducer,
});
