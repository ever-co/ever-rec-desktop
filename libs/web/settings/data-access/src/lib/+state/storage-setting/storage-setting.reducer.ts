import { IUsedSize } from '@ever-co/shared-utils';
import { createFeature, createReducer, on } from '@ngrx/store';
import { settingStorageActions } from './storage-setting.actions';

export const settingStorageFeatureKey = 'settingStorageRetention';

export interface IStorageState {
  retention: number;
  used: IUsedSize;
  error: string;
}

const initialState: IStorageState = {
  retention: 7,
  used: {
    screenshot: 0,
    video: 0,
    total: 0
  },
  error: '',
};

export const reducer = createReducer(
  initialState,
  on(settingStorageActions.load, (state) => ({ ...state, error: '' })),
  on(settingStorageActions.loadSuccess, (state, { retention, used }) => ({
    ...state,
    retention: retention ?? state.retention,
    used: used ?? state.used,
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
