import { APP_INITIALIZER } from '@angular/core';
import {
  selectSettingStorageState,
  settingStorageActions,
  StorageElectronService,
} from '@ever-co/web-setting-data-access';
import { Store } from '@ngrx/store';
import { distinctUntilChanged, filter, map, tap } from 'rxjs';

/**
 * Initializes the data retention period from the storage state.
 * When the retention period changes, it cleans up the data older than the new retention period.
 * @param store The store to select the state from and dispatch the load action to.
 * @param storageService The storage service to clean up the data.
 * @returns A function that, when called, sets up the subscription to the retention period and cleans up the data.
 */
export function initializeRetentionFactory(
  store: Store,
  storageService: StorageElectronService
): () => void {
  store.dispatch(settingStorageActions.load());

  return () => {
    store
      .select(selectSettingStorageState)
      .pipe(
        filter((retention) => retention.retention !== -1),
        distinctUntilChanged(),
        map((state) => state.retention),
        distinctUntilChanged(),
        tap((retention) => storageService.cleanUp({ retention }))
      )
      .subscribe();
  };
}

/**
 * Provider for initializing the data retention period from the storage state.
 * When the retention period changes, it cleans up the data older than the new retention period.
 */
export const rententionProvider = {
  provide: APP_INITIALIZER,
  useFactory: initializeRetentionFactory,
  deps: [Store, StorageElectronService],
  /**
   * This is a multi provider, so it can be used in combination with other {@link APP_INITIALIZER}s.
   */
  multi: true,
};
