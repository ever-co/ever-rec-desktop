import { INotification } from '@ever-co/shared-utils';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const notificationActions = createActionGroup({
  source: 'Notification',
  events: {
    'Load Notifications': emptyProps(),
    'Load Notifications Success': props<{ notifications: INotification[] }>(),

    'Add Notification': props<{ notification: INotification }>(),
    'Remove Notification': props<{ id: string }>(),
    'Mark As Read': props<{ id: string }>(),
    'Clear All Notifications': emptyProps(),
  },
});
