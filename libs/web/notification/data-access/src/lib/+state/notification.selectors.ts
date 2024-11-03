import { createFeatureSelector } from '@ngrx/store';
import * as fromNotification from './notification.reducer';

export const selectNotificationState = createFeatureSelector<fromNotification.NotificationState>(
  fromNotification.notificationFeatureKey
);
