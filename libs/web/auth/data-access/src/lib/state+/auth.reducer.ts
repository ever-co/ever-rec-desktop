import { IUser } from '@ever-co/shared-utils';
import { createFeature, createReducer, on } from '@ngrx/store';
import { authActions } from './auth.action';

export const authFeatureKey = 'authentication';

export interface IAuthState {
  user: IUser | null;
  token: string | null;
  expiresAt: string | null;
  loading: boolean;
  error: string | null;
}

export const initialAuthState: IAuthState = {
  user: null,
  token: null,
  expiresAt: null,
  loading: false,
  error: null,
};

export const reducer = createReducer(
  initialAuthState,

  on(
    authActions.login,
    authActions.logout,
    authActions.loginWithGoogle,
    authActions.signUp,
    (state) => ({
      ...state,
      loading: true,
    }),
  ),

  on(authActions.loginSuccess, (state, { user, token, expiresAt }) => ({
    ...state,
    loading: false,
    user,
    token,
    expiresAt,
  })),

  on(
    authActions.loginFailure,
    authActions.logoutFailure,
    authActions.signUpFailure,
    (state, { error }) => ({
      ...state,
      loading: false,
      error,
    }),
  ),

  on(authActions.logoutSuccess, (state) => ({
    ...state,
    loading: false,
    user: null,
    token: null,
  })),

  on(authActions.refreshTokenSuccess, (state, { token, expiresAt }) => ({
    ...state,
    token,
    expiresAt,
    error: null,
  })),

  on(authActions.refreshTokenFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  on(authActions.signUpSuccess, (state) => ({
    ...state,
    loading: false,
  })),
);

export const authFeature = createFeature({
  name: authFeatureKey,
  reducer,
});
