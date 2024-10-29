import { Store } from '@ngrx/store';
import { distinctUntilChanged, map, tap } from 'rxjs';
import { StorageElectronService } from '../+state/services/storage-electron.service';
import { settingStorageActions } from '../+state/storage-setting/storage-setting.actions';
import { selectSettingStorageState } from '../+state/storage-setting/storage-setting.selectors';

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
        map((state) => state.retention),
        distinctUntilChanged(),
        tap((retention) => storageService.cleanUp({ retention }))
      )
      .subscribe();
  };
}
