import { IVideoConfig } from '@ever-co/shared-utils';
import { createFeature, createReducer, on } from '@ngrx/store';
import { generateVideoSettingActions } from './generate-video-setting.actions';

export const generateVideoSettingFeatureKey = 'generateVideoSetting';

export interface GenerateVideoSettingState {
  videoConfig: IVideoConfig;
  error: string;
}

export const initialGenerateVideoSettingState: GenerateVideoSettingState = {
  videoConfig: {
    codec: 'libx264',
    resolution: '1920:1080',
    frameRate: 15,
    duration: 60,
    batch: 100,
    optimized: true,
    autoGenerate: true,
    period: 10,
  },
  error: '',
};

export const reducer = createReducer(
  initialGenerateVideoSettingState,
  on(generateVideoSettingActions.load, (state) => ({ ...state, error: '' })),
  on(generateVideoSettingActions.loadSuccess, (state, { videoConfig }) => ({
    ...state,
    videoConfig: videoConfig ?? state.videoConfig,
  })),
  on(generateVideoSettingActions.failure, (state, { error }) => ({
    ...state,
    error,
  })),
);

export const generateVideoSettingFeature = createFeature({
  name: generateVideoSettingFeatureKey,
  reducer,
});
