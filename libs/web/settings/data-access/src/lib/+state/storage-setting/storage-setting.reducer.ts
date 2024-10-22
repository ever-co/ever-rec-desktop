import { createFeature, createReducer, on } from '@ngrx/store';
import { settingStorageActions } from './storage-setting.actions';

export const settingStorageFeatureKey = 'settingStorageRetention';

export interface IStorageState {
  retention: number;
  size: number;
  error: string;
}

const initialState: IStorageState = {
  retention: 7,
  size: 0,
  error: '',
};

export const reducer = createReducer(
  initialState,
  on(settingStorageActions.load, (state) => ({ ...state, error: '' })),
  on(settingStorageActions.loadSuccess, (state, { retention, size }) => ({
    ...state,
    retention: retention ?? initialState.retention,
    size: size ?? initialState.size
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
