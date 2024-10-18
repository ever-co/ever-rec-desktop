import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideState } from '@ngrx/store';
import { sidebarFeature } from './+state/sidebar.reducer';

export function provideSidebarDataAccess(): EnvironmentProviders {
  return makeEnvironmentProviders([provideState(sidebarFeature)]);
}
