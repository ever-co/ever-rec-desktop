import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { notificationActions } from '../+state/notification.actions';
import { Notification } from '../model/notification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(
    private readonly store: Store,
    private readonly snackBar: MatSnackBar
  ) {}

  public show(message: string, type: 'success' | 'error' | 'info' | 'warning') {
    const notification = new Notification(message, type, new Date(), false);
    this.store.dispatch(
      notificationActions.addNotification({
        notification: notification.toDTO(),
      })
    );
    // Show snackbar for immediate feedback
    this.snackBar.open(message, undefined, {
      duration: 3000,
      panelClass: [`bg-${type}`],
      politeness: 'assertive',
      horizontalPosition: 'center',
      verticalPosition: 'top',
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
