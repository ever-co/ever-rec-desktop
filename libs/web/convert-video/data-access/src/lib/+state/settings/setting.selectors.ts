import { createFeatureSelector } from '@ngrx/store';
import * as fromSetting from './setting.reducer';

export const selectSettingState = createFeatureSelector<fromSetting.State>(
  fromSetting.settingFeatureKey
);
