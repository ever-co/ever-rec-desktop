import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { autoSyncProvider } from './auto-sync/auto-sync.factory';
import { rententionProvider } from './retention/initialize-retention.factory';
import { autoTrackingProvider } from './auto-tracking/auto-tracking.factory';

export function provideFactoriesDataAccess(): EnvironmentProviders {
  return makeEnvironmentProviders([
    autoSyncProvider,
    rententionProvider,
    autoTrackingProvider,
  ]);
}
