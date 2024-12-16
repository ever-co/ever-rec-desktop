import { IS3Config, IUsedSize } from '@ever-co/shared-utils';
import { createFeature, createReducer, on } from '@ngrx/store';
import { settingStorageActions } from './storage-setting.actions';

export const settingStorageFeatureKey = 'settingStorageRetention';

export interface IStorageState {
  retention: number;
  autoScreenshotDeletion: boolean;
  used: IUsedSize;
  s3Config: IS3Config;
  error: string;
}

const initialState: IStorageState = {
  retention: 7,
  autoScreenshotDeletion: false,
  s3Config: {
    accessKeyId: '',
    accessKeySecret: '',
    region: '',
    s3Bucket: '',
    s3Endpoint: '',
    autoSync: false,
  },
  used: {
    screenshot: 0,
    video: 0,
    total: 0,
  },
  error: '',
};

export const reducer = createReducer(
  initialState,
  on(settingStorageActions.load, (state) => ({ ...state, error: '' })),
  on(
    settingStorageActions.loadSuccess,
    (state, { retention, used, s3Config, autoScreenshotDeletion }) => ({
      ...state,
      s3Config: s3Config ?? state.s3Config,
      retention: retention ?? state.retention,
      used: used ?? state.used,
      autoScreenshotDeletion: autoScreenshotDeletion ?? state.autoScreenshotDeletion,
    })
  ),
  on(settingStorageActions.failure, (state, { error }) => ({
    ...state,
    error,
  }))
);

export const settingStorageFeature = createFeature({
  name: settingStorageFeatureKey,
  reducer,
});
