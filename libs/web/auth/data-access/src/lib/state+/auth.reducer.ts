import { IUser } from '@ever-co/shared-utils';
import { createFeature, createReducer, on } from '@ngrx/store';
import { authActions } from './auth.action';

export const authFeatureKey = 'authentication';

export interface IAuthState {
  user: IUser | null;
  token: string | null;
  refreshToken: string | null;
  expiresAt: string | null;
  loading: boolean;
  error: string | null;
  cooldown: number;
  emailSent: boolean;
  email: string;
}

export const initialAuthState: IAuthState = {
  user: null,
  token: null,
  refreshToken: null,
  expiresAt: null,
  loading: false,
  error: null,
  cooldown: 0,
  emailSent: false,
  email: '',
};

export const reducer = createReducer(
  initialAuthState,

  on(
    authActions.login,
    authActions.logout,
    authActions.loginWithGoogle,
    authActions.signUp,
    authActions.sendVerificationEmail,
    (state) => ({
      ...state,
      loading: true,
    }),
  ),

  on(authActions.loginSuccess, (state, { user, token, refreshToken, expiresAt }) => ({
    ...state,
    loading: false,
    user,
    token,
    refreshToken,
    expiresAt,
  })),

  on(
    authActions.loginFailure,
    authActions.logoutFailure,
    authActions.signUpFailure,
    authActions.sendVerificationEmailFailure,
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

  on(authActions.refreshTokenSuccess, (state, { token, refreshToken, expiresAt }) => ({
    ...state,
    token,
    refreshToken,
    expiresAt,
    error: null,
  })),

  on(authActions.refreshTokenFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  on(
    authActions.signUpSuccess,
    authActions.sendVerificationEmailSuccess,
    (state) => ({
      ...state,
      loading: false,
    }),
  ),

  on(authActions.startCooldown, (state, { seconds }) => ({
    ...state,
    cooldown: seconds,
  })),

  on(authActions.decrementCooldown, (state) => ({
    ...state,
    cooldown: state.cooldown > 0 ? state.cooldown - 1 : 0,
  })),

  on(authActions.resetCooldown, (state) => ({
    ...state,
    cooldown: 0,
  })),

  // Verification polling error handling
  on(authActions.checkVerificationFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  on(authActions.startVerificationPolling, (state) => ({
    ...state,
    error: null,
  })),

  on(authActions.resetPassword, (state, { email }) => ({
    ...state,
    loading: true,
    email,
    emailSent: false,
  })),

  on(authActions.resetPasswordSuccess, (state) => ({
    ...state,
    emailSent: true,
    loading: false,
  })),

  on(authActions.resetPasswordFailure, (state, { error }) => ({
    ...state,
    error,
    emailSent: false,
  })),

  on(authActions.resetForm, (state) => ({
    ...state,
    email: '',
    emailSent: false,
  })),

  on(authActions.updateProfile, (state, { user }) => ({
    ...state,
    user: user ?? state.user,
  })),
);

export const authFeature = createFeature({
  name: authFeatureKey,
  reducer,
});
