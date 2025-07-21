import { createFeature, createReducer, on } from '@ngrx/store';
import { User } from 'firebase/auth';
import { userUpdateActions } from './user-update.action';

export const userUpdateFeatureKey = 'user update';

export interface IUserUpdateState {
  loading: boolean;
  error: string | null;
}

export const initialAuthState: IUserUpdateState = {
  loading: false,
  error: null,
};

export const reducer = createReducer(
  initialAuthState,

  on(userUpdateActions.fullName, (state) => ({
    ...state,
    loading: true,
  })),

  on(userUpdateActions.fullNameSuccess, (state) => ({
    ...state,
    loading: false,
  })),

  on(
    userUpdateActions.fullNameFailure,

    (state, { error }) => ({
      ...state,
      loading: false,
      error,
    }),
  ),
);

export const userUpdateFeature = createFeature({
  name: userUpdateFeatureKey,
  reducer,
});
