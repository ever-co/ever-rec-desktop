import { createFeatureSelector } from '@ngrx/store';
import * as fromScreenshot from './screenshot.reducer';

export const selectScreenshotState =
  createFeatureSelector<fromScreenshot.IScreenshotState>(
    fromScreenshot.screenshotFeatureKey
  );
