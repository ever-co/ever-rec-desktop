import { IScreenshot } from '@ever-co/shared-utils';
import { createFeature, createReducer, on } from '@ngrx/store';
import { screenshotActions } from './screenshot.actions';

export const screenshotFeatureKey = 'screenshot';

export interface IScreenshotState {
  capturing: boolean;
  screenshots: IScreenshot[];
  hasNext: boolean;
  count: number;
  loading: boolean;
  filter: string;
  error: string;
}

export const initialState: IScreenshotState = {
  capturing: false,
  loading: false,
  screenshots: [],
  filter: '',
  hasNext: false,
  count: 0,
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
    count: state.count + 1,
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
  on(
    screenshotActions.loadScreenshotsSuccess,
    (state, { data, hasNext, count }) => ({
      ...state,
      count,
      hasNext,
      screenshots: [
        ...new Map(
          [...state.screenshots, ...data].map((item) => [item.id, item])
        ).values(),
      ],
      loading: false,
      error: '',
    })
  ),
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
  on(screenshotActions.deleteScreenshotsSuccess, () => ({
    ...initialState
  })),
  on(screenshotActions.deleteScreenshotsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(screenshotActions.ask, (state, { filter = '' }) => ({
    ...state,
    filter,
    loading: true,
    error: '',
  })),
  on(
    screenshotActions.askSuccess,
    (state, { data: screenshots, hasNext, count }) => ({
      ...state,
      loading: false,
      hasNext,
      count,
      screenshots,
    })
  ),
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
