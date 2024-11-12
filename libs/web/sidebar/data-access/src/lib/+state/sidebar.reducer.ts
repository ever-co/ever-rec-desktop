import { createFeature, createReducer, on } from '@ngrx/store';
import { sidebarActions } from './sidebar.actions';

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
  { title: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
  { title: 'My Library', icon: 'video_library', route: '/library' },
  { title: 'Activities', icon: 'trending_up', route: '/activities' },
  { title: 'Timeline', icon: 'web_stories', route: '/timesheet' },
  { title: 'Settings', icon: 'settings', route: '/settings' }
];

export const initialState: ISidebarState = {
  selectedItem: navigationItems[0],
  navigationItems,
};

export const reducer = createReducer(
  initialState,
  on(sidebarActions.loadSidebars, (state) => state),
  on(sidebarActions.selectNavigationItem, (state, { selectedItem }) => ({
    ...state,
    selectedItem,
  })),
  on(sidebarActions.navigate, (state, { route }) => {
    if (!route) {
      return { ...state };
    }

    const matchedItem = navigationItems.find((item) =>
      route.includes(item.route)
    );

    if (!matchedItem) {
      return { ...state };
    }

    return {
      ...state,
      selectedItem: matchedItem,
    };
  })
);

export const sidebarFeature = createFeature({
  name: sidebarFeatureKey,
  reducer,
});
