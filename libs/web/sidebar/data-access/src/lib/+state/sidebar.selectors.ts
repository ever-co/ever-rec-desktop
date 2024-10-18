import { createFeatureSelector } from '@ngrx/store';
import * as fromSidebar from './sidebar.reducer';

export const selectSidebarState = createFeatureSelector<fromSidebar.ISidebarState>(
  fromSidebar.sidebarFeatureKey
);
