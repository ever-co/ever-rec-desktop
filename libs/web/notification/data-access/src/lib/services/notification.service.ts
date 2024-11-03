import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { INotification } from '@ever-co/shared-utils';
import { Store } from '@ngrx/store';
import { notificationActions } from '../+state/notification.actions';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private store: Store, private snackBar: MatSnackBar) {}

  public show(message: string, type: 'success' | 'error' | 'info' | 'warning') {
    const notification: INotification = {
      id: crypto.randomUUID(),
      message,
      type,
      timestamp: new Date(),
      read: false,
    };

    this.store.dispatch(notificationActions.addNotification({ notification }));

    // Show snackbar for immediate feedback
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: [`bg-${type}`],
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
