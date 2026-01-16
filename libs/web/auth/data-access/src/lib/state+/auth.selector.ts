import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAuth from './auth.reducer';

export const selectAuthState = createFeatureSelector<fromAuth.IAuthState>(
  fromAuth.authFeatureKey,
);

export const selectUser = createSelector(
  selectAuthState,
  (state) => state.user,
);

export const selectToken = createSelector(
  selectAuthState,
  (state) => state.token,
);

export const selectRefreshToken = createSelector(
  selectAuthState,
  (state) => state.refreshToken,
);

export const selectClaimsToken = createSelector(selectAuthState, (state) => ({
  token: state.token ?? '',
  refreshToken: state.refreshToken ?? '',
  expiresAt: state.expiresAt ?? '',
}));

export const selectAuthLoading = createSelector(
  selectAuthState,
  (state) => state.loading,
);

export const selectDeletingAccount = createSelector(
  selectAuthState,
  (state) => state.deletingAccount,
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state) => state.error,
);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  ({ user, expiresAt }) => !!user && isSessionValid(expiresAt),
);

export const selectIsVerified = createSelector(
  selectAuthState,
  ({ user }) => user?.isVerified,
);

export const selectCooldown = createSelector(
  selectAuthState,
  (state) => state.cooldown,
);

export const selectEmail = createSelector(
  selectAuthState,
  ({ email }) => email,
);

export const selectEmailSent = createSelector(
  selectAuthState,
  ({ emailSent }) => emailSent,
);

function isSessionValid(expiresAt: string | null): boolean {
  if (!expiresAt) return false;
  return new Date(expiresAt).getTime() > Date.now();
}
