import { createFeature, createReducer, on } from '@ngrx/store';
import { IScreenshot } from '@prototype/shared/utils';
import { screenshotActions } from './screenshot.actions';

export const screenshotFeatureKey = 'screenshot';

export interface IScreenshotState {
  capturing: boolean;
  screenshots: IScreenshot[];
  loading: boolean;
  error: string;
}

export const initialState: IScreenshotState = {
  capturing: false,
  loading: false,
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
  on(screenshotActions.captureSuccess, (state, { screenshot }) => ({
    ...state,
    screenshots: [...state.screenshots, screenshot],
    error: '',
  })),
  on(screenshotActions.captureFailure, (state, { error }) => ({
    ...state,
    capturing: false,
    error,
  })),
  on(screenshotActions.loadScreenshots, (state) => ({
    ...state,
    loading: true,
    error: '',
  })),
  on(screenshotActions.loadScreenshotsSuccess, (state, { screenshots }) => ({
    ...state,
    screenshots: [
      ...new Map(
        [...state.screenshots, ...screenshots].map((item) => [item.id, item])
      ).values(),
    ],
    loading: false,
    error: '',
  })),
  on(screenshotActions.loadScreenshotsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(screenshotActions.deleteScreenshots, (state) => ({
    ...state,
    loading: true,
    error: '',
  })),
  on(screenshotActions.deleteScreenshotsSuccess, (state) => ({
    ...state,
    screenshots: [],
    loading: false,
    error: '',
  })),
  on(screenshotActions.deleteScreenshotsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(screenshotActions.ask, (state) => ({
    ...state,
    loading: true,
    error: '',
  })),
  on(screenshotActions.askSuccess, (state, { screenshots }) => ({
    ...state,
    loading: false,
    screenshots,
  })),
  on(screenshotActions.askFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);

export const screenshotFeature = createFeature({
  name: screenshotFeatureKey,
  reducer,
});
