import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromSetting from './storage-setting.reducer';

export const selectSettingStorageState =
  createFeatureSelector<fromSetting.IStorageState>(
    fromSetting.settingStorageFeatureKey
  );

export const selectSettingUploadAutoSync = createSelector(
  selectSettingStorageState,
  ({ uploadConfig }) => uploadConfig.autoSync
);
