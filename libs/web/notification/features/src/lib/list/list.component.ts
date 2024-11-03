import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import {
  NotificationService,
  selectNotificationState,
} from '@ever-co/notification-data-access';
import { NoDataComponent } from '@ever-co/shared-components';
import { INotification } from '@ever-co/shared-utils';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'lib-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, NoDataComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent {
  notifications$: Observable<INotification[]>;
  available$: Observable<boolean>;

  constructor(
    private store: Store,
    private notificationService: NotificationService
  ) {
    this.notifications$ = this.store
      .select(selectNotificationState)
      .pipe(map((state) => state.notifications));

    this.available$ = this.store
      .select(selectNotificationState)
      .pipe(map((state) => state.notifications.length > 0));
  }

  public getNotificationClass(notification: INotification): string {
    return `notification-${notification.type}`;
  }

  public markAsRead(id: string) {
    this.notificationService.markAsRead(id);
  }

  public removeNotification(id: string) {
    this.notificationService.remove(id);
  }
}
