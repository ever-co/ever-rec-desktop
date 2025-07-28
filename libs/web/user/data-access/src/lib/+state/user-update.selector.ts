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

export const selectEmailUpdating = createSelector(
  selectUserUpdateState,
  (state) => state.emailUpdating,
);

export const selectFullNameUpdateError = createSelector(
  selectUserUpdateState,
  (state) => state.fullNameError,
);

export const selectEmailUpdateError = createSelector(
  selectUserUpdateState,
  (state) => state.emailError,
);
