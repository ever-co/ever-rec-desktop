import { Store } from '@ngrx/store';
import { distinctUntilChanged, map, tap } from 'rxjs';
import { StorageElectronService } from '../+state/services/storage-electron.service';
import { settingStorageActions } from '../+state/storage-setting/storage-setting.actions';
import { selectSettingStorageState } from '../+state/storage-setting/storage-setting.selectors';

export function initializeRetentionFactory(
  store: Store,
  service: StorageElectronService
): () => void {
  store.dispatch(settingStorageActions.load());
  return () => {
    store
      .select(selectSettingStorageState)
      .pipe(
        map((state) => state.retention),
        distinctUntilChanged(),
        tap((retention) => service.cleanUp({ retention }))
      )
      .subscribe();
  };
}
