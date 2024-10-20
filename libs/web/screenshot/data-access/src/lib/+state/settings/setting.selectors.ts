import { createFeatureSelector } from '@ngrx/store';
import * as fromSetting from './setting.reducer';

export const selectSettingScreenCaptureState = createFeatureSelector<fromSetting.State>(
  fromSetting.settingScreenCaptureFeatureKey
);
