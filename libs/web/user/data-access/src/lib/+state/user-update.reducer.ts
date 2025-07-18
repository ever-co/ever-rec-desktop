import { createFeature, createReducer, on } from '@ngrx/store';
import { User } from 'firebase/auth';
import { userUpdateActions } from './user-update.action';

export const userUpdateFeatureKey = 'user update';

export interface IUserUpdateState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const initialAuthState: IUserUpdateState = {
  user: null,
  loading: false,
  error: null,
};

export const reducer = createReducer(
  initialAuthState,

  on(userUpdateActions.fullName, (state) => ({
    ...state,
    loading: true,
  })),

  on(userUpdateActions.fullNameSuccess, (state, { user }) => ({
    ...state,
    loading: false,
    user,
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
