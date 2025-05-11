import {
  IScreenshot,
  IScreenshotChartLine,
  IScreenshotMetadataStatistic,
  ISelected,
} from '@ever-co/shared-utils';
import { createFeature, createReducer, on } from '@ngrx/store';
import { screenshotActions } from './screenshot.actions';

export const screenshotFeatureKey = 'screenshot';

export interface IScreenshotState {
  capturing: boolean;
  screenshots: IScreenshot[];
  screenshot: IScreenshot | null;
  hasNext: boolean;
  count: number;
  loading: boolean;
  filter: string;
  deleting: boolean;
  purging: boolean;
  selectedScreenshots: ISelected<IScreenshot>[];
  statistic: {
    currents: IScreenshotMetadataStatistic[];
    hasNext: boolean;
    count: number;
  };
  search: {
    overlayOpen: boolean;
    screenshots: IScreenshot[];
    history: string[];
    hasNext: boolean;
    count: number;
    loading: boolean;
    filter: string;
  };
  chart: {
    dataLine: IScreenshotChartLine[];
    loading: boolean;
    error: string;
  };
  error: string;
}

export const initialState: IScreenshotState = {
  capturing: false,
  loading: false,
  screenshots: [],
  screenshot: null,
  selectedScreenshots: [],
  filter: '',
  hasNext: false,
  count: 0,
  error: '',
  deleting: false,
  purging: false,
  statistic: {
    currents: [],
    hasNext: false,
    count: 0,
  },
  search: {
    overlayOpen: false,
    loading: false,
    screenshots: [],
    history: [],
    filter: '',
    hasNext: false,
    count: 0,
  },
  chart: {
    dataLine: [],
    loading: false,
    error: '',
  },
};

export const reducer = createReducer(
  initialState,
  on(screenshotActions.startCapture, (state) => ({
    ...state,
    capturing: true,
  })),
  on(screenshotActions.startCaptureSuccess, (state) => ({
    ...state,
    capturing: true,
  })),
  on(screenshotActions.stopCaptureSuccess, (state) => ({
    ...state,
    capturing: false,
  })),
  on(screenshotActions.captureSuccess, (state, { screenshot }) => {
    const size = state.screenshots.length;
    const limit = size > 10 ? size : 10;

    return {
      ...state,
      count: state.count + 1,
      screenshots: [screenshot, ...state.screenshots].slice(0, limit),
      error: '',
    };
  }),
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
          [...state.screenshots, ...data].map((item) => [item.id, item]),
        ).values(),
      ],
      loading: false,
      error: '',
    }),
  ),
  on(screenshotActions.loadScreenshotsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(screenshotActions.deleteScreenshots, (state) => ({
    ...state,
    deleting: true,
    error: '',
  })),
  on(screenshotActions.deleteScreenshotsSuccess, () => ({
    ...initialState,
  })),
  on(screenshotActions.deleteScreenshotsFailure, (state, { error }) => ({
    ...state,
    deleting: false,
    error,
  })),

  on(screenshotActions.deleteScreenshot, (state) => ({
    ...state,
    loading: true,
    error: '',
  })),
  on(screenshotActions.deleteScreenshotSuccess, (state, { id }) => ({
    ...state,
    deleting: false,
    count: state.count - 1,
    screenshots: state.screenshots.filter((screenshot) => screenshot.id !== id),
  })),
  on(screenshotActions.deleteScreenshotFailure, (state, { error }) => ({
    ...state,
    deleting: false,
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
          [...state.search.screenshots, ...data].map((item) => [item.id, item]),
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

  on(screenshotActions.overlayClicked, (state, { isOpen }) => ({
    ...state,
    search: {
      ...state.search,
      overlayOpen: isOpen,
    },
  })),

  on(screenshotActions.resetAsk, (state) => ({
    ...state,
    search: {
      ...initialState.search,
      overlayOpen: state.search.overlayOpen,
      history: state.search.history,
    },
  })),

  on(
    screenshotActions.getScreenshotsStatisticsSuccess,
    (state, { hasNext, data, count }) => ({
      ...state,
      statistic: {
        hasNext,
        currents: [
          ...new Map(
            [...state.statistic.currents, ...data].map((item) => [
              item.name,
              item,
            ]),
          ).values(),
        ],
        count,
      },
    }),
  ),

  // Reset screenshots
  on(screenshotActions.resetScreenshots, (state) => ({
    ...state,
    screenshots: initialState.screenshots,
  })),

  // Reset screenshots statistics
  on(screenshotActions.resetScreenshotsStatistics, (state) => ({
    ...state,
    statistic: {
      ...state.statistic,
      currents: [],
    },
  })),

  // Delete selected screenshots
  on(screenshotActions.deleteSelectedScreenshots, (state) => ({
    ...state,
    deleting: true,
    error: '',
  })),
  on(
    screenshotActions.deleteSelectedScreenshotsSuccess,
    (state, { screenshots }) => {
      const screenshotIdsDeleted = screenshots.map(
        (screenshot) => screenshot.id,
      );

      // Filter out deleted screenshots
      const updatedScreenshots = state.screenshots.filter(
        (screenshot) => !screenshotIdsDeleted.includes(screenshot.id),
      );

      return {
        ...state,
        count: state.count - screenshots.length,
        screenshots: updatedScreenshots,
        deleting: false,
      };
    },
  ),

  on(
    screenshotActions.deleteSelectedScreenshotsFailure,
    (state, { error }) => ({
      ...state,
      deleting: false,
      error,
    }),
  ),

  // Select Screenshot
  on(screenshotActions.selectScreenshot, (state, { screenshot }) => ({
    ...state,
    selectedScreenshots: [
      ...new Map(
        [...state.selectedScreenshots, screenshot].map((item) => [item, item]),
      ).values(),
    ].filter((screenshot) => screenshot.selected),
  })),

  // Unselect Screenshot
  on(screenshotActions.unselectScreenshot, (state, { screenshot }) => ({
    ...state,
    selectedScreenshots: state.selectedScreenshots.filter(
      ({ data }) => screenshot.data.id !== data.id,
    ),
  })),

  // Unselect All Screenshots
  on(screenshotActions.unselectAllScreenshots, (state) => ({
    ...state,
    deleting: false,
    selectedScreenshots: [],
  })),

  //Search History
  on(screenshotActions.loadHistorySuccess, (state, { history }) => ({
    ...state,
    search: {
      ...state.search,
      history,
    },
  })),
  // Chart Line
  on(screenshotActions.getScreenshotsChartLine, (state) => ({
    ...state,
    chart: {
      ...state.chart,
      loading: true,
      error: '',
    },
  })),

  on(
    screenshotActions.getScreenshotsChartLineSuccess,
    (state, { dataLine }) => ({
      ...state,
      chart: {
        ...state.chart,
        dataLine,
        loading: false,
        error: '',
      },
    }),
  ),

  on(screenshotActions.getScreenshotsChartLineFailure, (state, { error }) => ({
    ...state,
    chart: {
      ...state.chart,
      loading: false,
      error,
    },
  })),

  on(screenshotActions.purge, (state) => ({
    ...state,
    purging: true,
  })),

  on(screenshotActions.purgeSuccess, () => ({
    ...initialState,
  })),

  on(screenshotActions.purgeFailure, (state, { error }) => ({
    ...state,
    purging: false,
    error,
  })),

  on(screenshotActions.loadScreenshot, (state) => ({
    ...state,
    loading: true,
  })),

  on(screenshotActions.loadScreenshotSuccess, (state, { screenshot }) => ({
    ...state,
    loading: false,
    screenshot,
  })),

  on(screenshotActions.loadScreenshotFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(screenshotActions.updateUploadedScreenshot, (state, { upload }) => {
    const { screenshot, screenshots } = state;
    const { itemId } = upload;

    // Check if updates are needed
    const shouldUpdateScreenshot = screenshot?.id === itemId;
    const shouldUpdateScreenshots = screenshots.some(
      (screenshot) => screenshot.id === itemId,
    );

    // Return unchanged state if no updates are needed
    if (!shouldUpdateScreenshot && !shouldUpdateScreenshots) return state;

    return {
      ...state,
      // Update screnshot if needed
      screenshot: shouldUpdateScreenshot
        ? { ...screenshot, synced: true }
        : screenshot,
      // Update audios array if needed (map preserves order)
      screenshots: shouldUpdateScreenshots
        ? screenshots.map((screenshot) =>
            screenshot.id === itemId
              ? { ...screenshot, synced: true }
              : screenshot,
          )
        : screenshots,
    };
  }),
);

export const screenshotFeature = createFeature({
  name: screenshotFeatureKey,
  reducer,
});
