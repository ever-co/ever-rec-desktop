import { createFeature, createReducer, on } from '@ngrx/store';
import { settingStorageActions } from './storage-setting.actions';

export const settingStorageFeatureKey = 'settingStorageRetention';

export interface IStorageState {
  retention: number;
  error: string;
}

const initialState: IStorageState = {
  retention: 7,
  error: '',
};

export const reducer = createReducer(
  initialState,
  on(settingStorageActions.load, (state) => ({ ...state, error: '' })),
  on(settingStorageActions.loadSuccess, (state, { retention }) => ({
    ...state,
    retention: retention ?? initialState.retention,
  })),
  on(settingStorageActions.failure, (state, { error }) => ({
    ...state,
    error,
  }))
);

export const settingStorageFeature = createFeature({
  name: settingStorageFeatureKey,
  reducer,
});
