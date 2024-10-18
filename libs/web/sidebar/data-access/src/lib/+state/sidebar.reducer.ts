import { createFeature, createReducer, on } from '@ngrx/store';
import { SidebarActions } from './sidebar.actions';

export const sidebarFeatureKey = 'sidebar';

export interface INavigationState {
  title: string;
  icon: string;
  route: string;
}

export interface ISidebarState {
  selectedItem: INavigationState;
  navigationItems: INavigationState[];
}

const navigationItems = [
  { title: 'Home', icon: 'home', route: '/home' },
  { title: 'My Library', icon: 'video_library', route: '/library' },
  { title: 'Notifications', icon: 'notifications', route: '/notifications' },
  { title: 'Watch Later', icon: 'watch_later', route: '/watch-later' },
  { title: 'History', icon: 'history', route: '/history' },
  { title: 'Settings', icon: 'settings', route: '/settings' },
];

export const initialState: ISidebarState = {
  selectedItem: navigationItems[0],
  navigationItems,
};

export const reducer = createReducer(
  initialState,
  on(SidebarActions.loadSidebars, (state) => state),
  on(SidebarActions.selectNavigationItem, (state, { selectedItem }) => ({
    ...state,
    selectedItem,
  }))
);

export const sidebarFeature = createFeature({
  name: sidebarFeatureKey,
  reducer,
});
