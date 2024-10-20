import { createFeatureSelector } from '@ngrx/store';
import * as fromSetting from './storage-setting.reducer';

export const selectSettingStorageState = createFeatureSelector<fromSetting.IStorageState>(
  fromSetting.settingStorageFeatureKey
);
