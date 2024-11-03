import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  NotificationService,
  selectNotificationState,
} from '@ever-co/notification-data-access';
import { PopoverDirective } from '@ever-co/shared-service';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { ListComponent } from '../list/list.component';

@Component({
  selector: 'lib-notification-badge',
  standalone: true,
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
  styleUrl: './badge.component.scss',
})
export class NotificationBadgeComponent {
  public unreadCount$!: Observable<number>;

  constructor(
    private store: Store,
    private notificationService: NotificationService
  ) {
    this.unreadCount$ = this.store
      .select(selectNotificationState)
      .pipe(
        map(({ notifications }) => notifications.filter((n) => !n.read).length)
      );
  }

  clearAll() {
    this.notificationService.clearAll();
  }
}
