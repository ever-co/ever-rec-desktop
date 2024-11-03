import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { LocalStorageService } from '@ever-co/shared-service';
import { INotification } from '@ever-co/shared-utils';
import { EMPTY } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
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

  public removeNotification$ = createEffect(
    () => {
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
                .pipe(map(() => EMPTY))
            )
          )
        )
      );
    },
    { dispatch: false }
  );

  clearNotifications$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(notificationActions.clearAllNotifications),
        switchMap(() =>
          this.localStorageService.removeItem(this.KEY).pipe(map(() => EMPTY))
        )
      );
    },
    { dispatch: false }
  );

  public addNotification$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(notificationActions.addNotification),
        switchMap(({ notification }) =>
          this.localStorageService.getItem<INotification[]>(this.KEY).pipe(
            map((notifications) => notifications ?? []),
            switchMap((notifications) =>
              this.localStorageService
                .setItem<INotification[]>(this.KEY, [
                  ...notifications,
                  notification,
                ])
                .pipe(map(() => EMPTY))
            )
          )
        )
      );
    },
    { dispatch: false }
  );

  public markAsRead$ = createEffect(
    () => {
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
                .pipe(map(() => EMPTY))
            )
          )
        )
      );
    },
    { dispatch: false }
  );
  constructor(
    private actions$: Actions,
    private readonly localStorageService: LocalStorageService
  ) {}
}
