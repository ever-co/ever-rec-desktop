import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromTimeline from './timeline.reducer';

export const selectTimelineState = createFeatureSelector<fromTimeline.State>(
  fromTimeline.timelineFeatureKey
);
