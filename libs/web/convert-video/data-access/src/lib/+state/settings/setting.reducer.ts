import { createFeature, createReducer, on } from '@ngrx/store';
import { IVideoConfig } from '@prototype/shared/utils';
import { settingActions } from './setting.actions';

export const settingFeatureKey = 'setting';

export interface State {
  videoConfig: IVideoConfig;
  error: string;
}

export const initialState: State = {
  videoConfig: {
    codec: 'libx264',
    resolution: '1920:1080',
    frameRate: 30,
    duration: 60,
    batch: 100
  },
  error: '',
};

export const reducer = createReducer(
  initialState,
  on(settingActions.load, (state) => ({ ...state, error: '' })),
  on(settingActions.loadSuccess, (state, { videoConfig }) => ({
    ...state,
    videoConfig: videoConfig ?? initialState.videoConfig,
  })),
  on(settingActions.failure, (state, { error }) => ({
    ...state,
    error,
  }))
);

export const settingFeature = createFeature({
  name: settingFeatureKey,
  reducer,
});
