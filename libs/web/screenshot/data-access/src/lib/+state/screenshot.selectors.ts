import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromScreenshot from './screenshot.reducer';

export const selectScreenshotState =
  createFeatureSelector<fromScreenshot.IScreenshotState>(
    fromScreenshot.screenshotFeatureKey,
  );

export const selectScreesnhotStatisticsData = createSelector(
  selectScreenshotState,
  (state) => state.statistic.data,
);
