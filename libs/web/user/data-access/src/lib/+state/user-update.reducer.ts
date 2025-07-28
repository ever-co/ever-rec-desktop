import { createFeature, createReducer, on } from '@ngrx/store';
import { userUpdateActions } from './user-update.action';

export const userUpdateFeatureKey = 'user update';

export interface IUserUpdateState {
  fullNameUpdating: boolean;
  emailUpdating: boolean;
  emailError: string | null;
  fullNameError: string | null;
}

export const initialAuthState: IUserUpdateState = {
  fullNameUpdating: false,
  emailUpdating: false,
  emailError: null,
  fullNameError: null,
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

  on(userUpdateActions.reset, () => initialAuthState),
);

export const userUpdateFeature = createFeature({
  name: userUpdateFeatureKey,
  reducer,
});
