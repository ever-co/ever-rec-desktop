import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { INavigationState } from './sidebar.reducer';

export const sidebarActions = createActionGroup({
  source: 'Sidebar',
  events: {
    'Load Sidebars': emptyProps(),
    'Select Navigation Item': props<{ selectedItem: INavigationState }>(),
    'Navigate': props<{ route: INavigationState['route']}>(),
  },
});
