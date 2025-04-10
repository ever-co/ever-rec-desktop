import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  notificationActions,
  NotificationService,
  selectNotificationState,
} from '@ever-co/notification-data-access';
import { PopoverDirective } from '@ever-co/shared-service';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { ListComponent } from '../list/list.component';

@Component({
    selector: 'lib-notification-badge',
    imports: [
        CommonModule,
        MatCardModule,
        PopoverDirective,
        MatIconModule,
        ListComponent,
        MatButtonModule,
        MatTooltipModule,
    ],
    templateUrl: './badge.component.html',
    styleUrl: './badge.component.scss'
})
export class NotificationBadgeComponent implements OnInit {
  public unreadCount$!: Observable<number>;
  public available$!: Observable<boolean>;

  constructor(
    private store: Store,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.unreadCount$ = this.store
      .select(selectNotificationState)
      .pipe(
        map(({ notifications }) => notifications.filter((n) => !n.read).length)
      );
    this.available$ = this.store
      .select(selectNotificationState)
      .pipe(map(({ notifications }) => notifications.length > 0));
    this.store.dispatch(notificationActions.loadNotifications());
  }

  clearAll() {
    this.notificationService.clearAll();
  }
}
