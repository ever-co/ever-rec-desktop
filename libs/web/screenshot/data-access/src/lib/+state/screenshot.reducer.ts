import {
  IScreenshot,
  IScreenshotMetadataStatistic,
} from '@ever-co/shared-utils';
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
  statistics: IScreenshotMetadataStatistic[];
  search: {
    screenshots: IScreenshot[];
    hasNext: boolean;
    count: number;
    loading: boolean;
    filter: string;
  };
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
  statistics: [],
  search: {
    loading: false,
    screenshots: [],
    filter: '',
    hasNext: false,
    count: 0,
  },
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
    screenshots:
      state.screenshots.length <= 10
        ? [...state.screenshots, screenshot]
        : state.screenshots,
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
    ...initialState,
  })),
  on(screenshotActions.deleteScreenshotsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(screenshotActions.ask, (state, { filter = '' }) => ({
    ...state,
    search: {
      ...state.search,
      filter,
      loading: true,
    },
    error: '',
  })),
  on(screenshotActions.askSuccess, (state, { data, hasNext, count }) => ({
    ...state,
    search: {
      ...state.search,
      loading: false,
      screenshots: [
        ...new Map(
          [...state.search.screenshots, ...data].map((item) => [item.id, item])
        ).values(),
      ],
      hasNext,
      count,
    },
  })),
  on(screenshotActions.askFailure, (state, { error }) => ({
    ...state,
    search: {
      ...state.search,
      loading: false,
    },
    error,
  })),

  on(screenshotActions.resetAsk, (state) => ({
    ...state,
    search: {
      ...initialState.search,
    },
  })),

  on(
    screenshotActions.getScreenshotsStatisticsSuccess,
    (state, { statistics }) => ({
      ...state,
      statistics,
    })
  )
);

export const screenshotFeature = createFeature({
  name: screenshotFeatureKey,
  reducer,
});
