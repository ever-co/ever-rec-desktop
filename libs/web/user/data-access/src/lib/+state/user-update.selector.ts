import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAuth from './user-update.reducer';

export const selectUserUpdateState =
  createFeatureSelector<fromAuth.IUserUpdateState>(
    fromAuth.userUpdateFeatureKey,
  );

export const selectFullNameUpdating = createSelector(
  selectUserUpdateState,
  (state) => state.fullNameUpdating,
);

export const selectUserUpdateError = createSelector(
  selectUserUpdateState,
  (state) => state.error,
);
