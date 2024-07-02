import { createFeatureSelector } from '@ngrx/store';
import * as fromBreadcrumb from './breadcrumb.reducer';

export const selectBreadcrumbState =
  createFeatureSelector<fromBreadcrumb.IBreadcrumbsState>(
    fromBreadcrumb.breadcrumbFeatureKey
  );
