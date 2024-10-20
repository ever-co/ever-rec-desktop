import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { SettingStorageEffects } from './+state/storage-setting/storage-setting.effects';
import { settingStorageFeature } from './+state/storage-setting/storage-setting.reducer';

export function provideSettingsDataAccess(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideState(settingStorageFeature),
    provideEffects([SettingStorageEffects]),
  ]);
}
