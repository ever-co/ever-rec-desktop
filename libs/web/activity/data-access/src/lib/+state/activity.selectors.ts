import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromActivity from './activity.reducer';

export const selectActivityState = createFeatureSelector<fromActivity.IActivityState>(
  fromActivity.activityFeatureKey
);

export const selectTopApplicationsProductivity = createSelector(
  selectActivityState,
  (state) => state?.topApplicationsProductivity || []
);
