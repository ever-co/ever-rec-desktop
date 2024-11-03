import { INotification } from '@ever-co/shared-utils';
import { createFeature, createReducer, on } from '@ngrx/store';
import { notificationActions } from './notification.actions';

export const notificationFeatureKey = 'notification';

export interface NotificationState {
  notifications: INotification[];
}

export const initialState: NotificationState = {
  notifications: [],
};

export const reducer = createReducer(
  initialState,
  on(notificationActions.loadNotifications, (state) => state),
  on(notificationActions.addNotification, (state, { notification }) => ({
    ...state,
    notifications: [notification, ...state.notifications],
  })),
  on(notificationActions.removeNotification, (state, { id }) => ({
    ...state,
    notifications: state.notifications.filter(
      (notification) => notification.id !== id
    ),
  })),
  on(notificationActions.markAsRead, (state, { id }) => ({
    ...state,
    notifications: state.notifications.map((notification) =>
      notification.id === id ? { ...notification, read: true } : notification
    ),
  })),
  on(notificationActions.clearAllNotifications, (state) => ({
    ...state,
    notifications: [],
  }))
);

export const notificationFeature = createFeature({
  name: notificationFeatureKey,
  reducer,
});
