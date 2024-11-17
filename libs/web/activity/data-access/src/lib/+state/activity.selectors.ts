import { createFeatureSelector } from '@ngrx/store';
import * as fromActivity from './activity.reducer';

export const selectActivityState = createFeatureSelector<fromActivity.IActivityState>(
  fromActivity.activityFeatureKey
);
