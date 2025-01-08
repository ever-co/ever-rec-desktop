import { Injectable } from '@angular/core';
import { MatSnackBarRef } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { notificationActions } from '../+state/notification.actions';
import { Notification } from '../model/notification.model';
import { SnackbarQueueService } from './snackbar-queue.service';
import { ComponentType } from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(
    private readonly store: Store,
    private readonly queueService: SnackbarQueueService
  ) {}

  public show<T>(
    message: string,
    type: 'success' | 'error' | 'info' | 'warning',
    options?: {
      component?: ComponentType<T>;
      afterDismissed?: () => void;
      afterOpened?: (snackbarRef?: MatSnackBarRef<T> | null) => void;
    }
  ) {
    const { component, afterOpened, afterDismissed } = options || {};

    this.queueService.enqueue({
      message,
      config: {
        duration: 3000,
        panelClass: [`bg-${type}`],
        politeness: 'assertive',
        horizontalPosition: 'center',
        verticalPosition: 'top',
      },
      component,
      afterDismissed,
      afterOpened: (snackbarRef?: MatSnackBarRef<T> | null) => {
        const notification = new Notification(message, type, new Date(), false);
        this.store.dispatch(
          notificationActions.addNotification({
            notification: notification.toDTO(),
          })
        );
        if (afterOpened) {
          afterOpened(snackbarRef);
        }
      },
    });
  }

  public remove(id: string) {
    this.store.dispatch(notificationActions.removeNotification({ id }));
  }

  public markAsRead(id: string) {
    this.store.dispatch(notificationActions.markAsRead({ id }));
  }

  public clearAll() {
    this.store.dispatch(notificationActions.clearAllNotifications());
  }
}
