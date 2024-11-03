import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { LocalStorageService } from '@ever-co/shared-service';
import { INotification } from '@ever-co/shared-utils';
import { map, switchMap, tap } from 'rxjs/operators';
import { NotificationElectronService } from '../services/notification-electron.service';
import { notificationActions } from './notification.actions';

@Injectable()
export class NotificationEffects {
  private readonly KEY = '_notifications';

  public loadNotifications$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(notificationActions.loadNotifications),
      switchMap(() =>
        this.localStorageService.getItem<INotification[]>(this.KEY).pipe(
          map((notifications) =>
            notificationActions.loadNotificationsSuccess({
              notifications: notifications ?? [],
            })
          )
        )
      )
    );
  });

  public removeNotification$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(notificationActions.removeNotification),
      switchMap(({ id }) =>
        this.localStorageService.getItem<INotification[]>(this.KEY).pipe(
          map((notifications) => notifications ?? []),
          switchMap((notifications) =>
            this.localStorageService
              .setItem<INotification[]>(this.KEY, [
                ...notifications.filter(
                  (notification) => notification.id !== id
                ),
              ])
              .pipe(map(() => notificationActions.updateIconBadgeCount()))
          )
        )
      )
    );
  });

  clearNotifications$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(notificationActions.clearAllNotifications),
      switchMap(() =>
        this.localStorageService
          .removeItem(this.KEY)
          .pipe(map(() => notificationActions.updateIconBadgeCount()))
      )
    );
  });

  public addNotification$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(notificationActions.addNotification),
      switchMap(({ notification }) =>
        this.localStorageService.getItem<INotification[]>(this.KEY).pipe(
          map((notifications) => notifications ?? []),
          switchMap((notifications) =>
            this.localStorageService
              .setItem<INotification[]>(this.KEY, [
                notification,
                ...notifications,
              ])
              .pipe(map(() => notificationActions.updateIconBadgeCount()))
          )
        )
      )
    );
  });

  public markAsRead$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(notificationActions.markAsRead),
      switchMap(({ id }) =>
        this.localStorageService.getItem<INotification[]>(this.KEY).pipe(
          map((notifications) => notifications ?? []),
          switchMap((notifications) =>
            this.localStorageService
              .setItem<INotification[]>(this.KEY, [
                ...notifications.map((notification) =>
                  notification.id === id
                    ? { ...notification, read: true }
                    : notification
                ),
              ])
              .pipe(map(() => notificationActions.updateIconBadgeCount()))
          )
        )
      )
    );
  });

  public updateIconCount$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(
          notificationActions.updateIconBadgeCount,
          notificationActions.loadNotifications
        ),
        switchMap(() =>
          this.localStorageService.getItem<INotification[]>(this.KEY).pipe(
            map((notifications) => notifications ?? []),
            tap((notifications) => {
              this.notificationService.setIconCounter(
                notifications.reduce((acc, n) => (n.read ? acc : acc + 1), 0)
              );
            })
          )
        )
      );
    },
    { dispatch: false }
  );
  constructor(
    private actions$: Actions,
    private readonly localStorageService: LocalStorageService,
    private readonly notificationService: NotificationElectronService
  ) {}
}
