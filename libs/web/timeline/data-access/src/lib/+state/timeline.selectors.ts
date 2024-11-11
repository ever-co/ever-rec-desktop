import { ITimelineState } from '@ever-co/shared-utils';
import { createFeatureSelector } from '@ngrx/store';
import * as fromTimeline from './timeline.reducer';

export const selectTimelineState = createFeatureSelector<ITimelineState>(
  fromTimeline.timelineFeatureKey
);
