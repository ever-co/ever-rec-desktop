import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAuth from './user-update.reducer';

export const selectUserUpdateState =
  createFeatureSelector<fromAuth.IUserUpdateState>(
    fromAuth.userUpdateFeatureKey,
  );

export const selectUserUpdate = createSelector(
  selectUserUpdateState,
  (state) => state.user,
);

export const selectUserUpdateLoading = createSelector(
  selectUserUpdateState,
  (state) => state.loading,
);

export const selectUserUpdateError = createSelector(
  selectUserUpdateState,
  (state) => state.error,
);
