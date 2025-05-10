import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromGenerateVideoSetting from './generate-video-setting.reducer';

export const selectGenerateVideoSettingState =
  createFeatureSelector<fromGenerateVideoSetting.GenerateVideoSettingState>(
    fromGenerateVideoSetting.generateVideoSettingFeatureKey,
  );

export const selectGenerateVideoConfig = createSelector(
  selectGenerateVideoSettingState,
  (state) => state.videoConfig,
);
