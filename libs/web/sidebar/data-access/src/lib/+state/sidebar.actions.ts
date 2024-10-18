import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { INavigationState } from './sidebar.reducer';

export const SidebarActions = createActionGroup({
  source: 'Sidebar',
  events: {
    'Load Sidebars': emptyProps(),
    'Select Navigation Item': props<{ selectedItem: INavigationState }>(),
  },
});
