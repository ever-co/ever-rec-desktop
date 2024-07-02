import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideState } from '@ngrx/store';
import { breadcrumbFeature } from './+state/breadcrumb.reducer';

export function provideBreadcrumbDataAccess(): EnvironmentProviders {
  return makeEnvironmentProviders([provideState(breadcrumbFeature)]);
}
