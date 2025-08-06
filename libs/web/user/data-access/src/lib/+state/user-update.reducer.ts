import { createFeature, createReducer, on } from '@ngrx/store';
import { userUpdateActions } from './user-update.action';

export const userUpdateFeatureKey = 'user update';

export interface IUserUpdateState {
  fullNameUpdating: boolean;
  emailUpdating: boolean;
  passwordUpdating: boolean;
  emailError: string | null;
  fullNameError: string | null;
  passwordError: string | null;
}

export const initialAuthState: IUserUpdateState = {
  fullNameUpdating: false,
  emailUpdating: false,
  passwordUpdating: false,
  emailError: null,
  fullNameError: null,
  passwordError: null,
};

export const reducer = createReducer(
  initialAuthState,

  on(userUpdateActions.fullName, (state) => ({
    ...state,
    fullNameError: null,
    fullNameUpdating: true,
  })),

  on(userUpdateActions.fullNameSuccess, (state) => ({
    ...state,
    fullNameUpdating: false,
  })),

  on(userUpdateActions.fullNameFailure, (state, { error }) => ({
    ...state,
    fullNameUpdating: false,
    fullNameError: error,
  })),

  on(userUpdateActions.email, (state) => ({
    ...state,
    emailError: null,
    emailUpdating: true,
  })),

  on(userUpdateActions.emailSuccess, (state) => ({
    ...state,
    emailUpdating: false,
  })),

  on(userUpdateActions.emailFailure, (state, { error }) => ({
    ...state,
    emailUpdating: false,
    emailError: error,
  })),

  on(userUpdateActions.password, (state) => ({
    ...state,
    passwordError: null,
    passwordUpdating: true,
  })),

  on(userUpdateActions.passwordSuccess, (state) => ({
    ...state,
    passwordUpdating: false,
  })),

  on(userUpdateActions.passwordFailure, (state, { error }) => ({
    ...state,
    passwordUpdating: false,
    passwordError: error,
  })),

  on(userUpdateActions.reset, () => initialAuthState),
);

export const userUpdateFeature = createFeature({
  name: userUpdateFeatureKey,
  reducer,
});
