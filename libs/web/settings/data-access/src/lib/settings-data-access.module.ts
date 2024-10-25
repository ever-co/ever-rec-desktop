import {
  APP_INITIALIZER,
  EnvironmentProviders,
  makeEnvironmentProviders,
} from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideState, Store } from '@ngrx/store';
import { StorageElectronService } from './+state/services/storage-electron.service';
import { SettingStorageEffects } from './+state/storage-setting/storage-setting.effects';
import { settingStorageFeature } from './+state/storage-setting/storage-setting.reducer';
import { initializeRetentionFactory } from './factory/initialize-retention.factory';

export function provideSettingsDataAccess(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideState(settingStorageFeature),
    provideEffects([SettingStorageEffects]),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeRetentionFactory,
      deps: [Store, StorageElectronService],
      multi: true,
    },
  ]);
}
