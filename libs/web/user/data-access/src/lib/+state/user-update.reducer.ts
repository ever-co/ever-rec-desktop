import { createFeature, createReducer, on } from '@ngrx/store';
import { userUpdateActions } from './user-update.action';

export const userUpdateFeatureKey = 'user update';

export interface IUserUpdateState {
  fullNameUpdating: boolean;
  emailUpdating: boolean;
  error: string | null;
}

export const initialAuthState: IUserUpdateState = {
  fullNameUpdating: false,
  emailUpdating: false,
  error: null,
};

export const reducer = createReducer(
  initialAuthState,

  on(userUpdateActions.fullName, (state) => ({
    ...state,
    fullNameUpdating: true,
  })),

  on(userUpdateActions.fullNameSuccess, (state) => ({
    ...state,
    fullNameUpdating: false,
  })),

  on(userUpdateActions.fullNameFailure, (state, { error }) => ({
    ...state,
    fullNameUpdating: false,
    error,
  })),

  on(userUpdateActions.email, (state) => ({
    ...state,
    emailUpdating: true,
  })),

  on(userUpdateActions.emailSuccess, (state) => ({
    ...state,
    emailUpdating: false,
  })),

  on(userUpdateActions.emailFailure, (state, { error }) => ({
    ...state,
    emailUpdating: false,
    error,
  })),
);

export const userUpdateFeature = createFeature({
  name: userUpdateFeatureKey,
  reducer,
});
