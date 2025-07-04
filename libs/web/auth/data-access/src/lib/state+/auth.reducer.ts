import { IUser } from '@ever-co/shared-utils';
import { createFeature, createReducer, on } from '@ngrx/store';
import { authActions } from './auth.action';

export const authFeatureKey = 'authentication';

export interface IAuthState {
  user: IUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export const initialAuthState: IAuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

export const reducer = createReducer(
  initialAuthState,

  on(authActions.login, authActions.logout, (state) => ({
    ...state,
    loading: true,
  })),

  on(authActions.loginSuccess, (state, { user, token }) => ({
    ...state,
    loading: false,
    user,
    token,
  })),

  on(
    authActions.loginFailure,
    authActions.logoutFailure,
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
);

export const authFeature = createFeature({
  name: authFeatureKey,
  reducer,
});
