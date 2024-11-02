import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { autoSyncProvider } from './auto-sync/auto-sync.factory';

export function provideFactoriesDataAccess(): EnvironmentProviders {
  return makeEnvironmentProviders([autoSyncProvider]);
}
