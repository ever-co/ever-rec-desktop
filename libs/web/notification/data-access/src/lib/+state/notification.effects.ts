import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { EMPTY, Observable } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { notificationActions } from './notification.actions';

@Injectable()
export class NotificationEffects {
  loadNotifications$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(notificationActions.loadNotifications),
      concatMap(() => EMPTY as Observable<{ type: string }>)
    );
  });
  constructor(private actions$: Actions) {}
}
