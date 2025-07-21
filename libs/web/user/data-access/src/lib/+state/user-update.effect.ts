import { inject, Injectable } from '@angular/core';
import {
  authActions,
  AuthService,
  UserAdapter,
} from '@ever-co/auth-data-access';
import { NotificationService } from '@ever-co/notification-data-access';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, from, map, of, switchMap } from 'rxjs';
import { userUpdateActions } from './user-update.action';

@Injectable()
export class UserUpdateEffects {
  private readonly actions$ = inject(Actions);
  private readonly authService = inject(AuthService);
  private readonly notiicationService = inject(NotificationService);

  public readonly profile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userUpdateActions.fullNameSuccess),
      switchMap(() => {
        const user = this.authService.checkIfUserIsSignedIn();

        if (!user) {
          return of(authActions.logout());
        }

        return from(user.reload()).pipe(
          map(() => {
            const adapter = new UserAdapter(user);
            return authActions.updateProfile({ user: adapter.clone() });
          }),
        );
      }),
    ),
  );

  public readonly fullName$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userUpdateActions.fullName),
      switchMap(({ fullName }) => {
        const user = this.authService.checkIfUserIsSignedIn();

        if (!user) {
          return of(
            userUpdateActions.fullNameFailure({
              error: 'User is not signed in.',
            }),
          );
        }

        return from(this.authService.updateProfile(user, { fullName })).pipe(
          map(() => userUpdateActions.fullNameSuccess()),
          catchError((error) =>
            of(
              userUpdateActions.fullNameFailure({
                error: error.message ?? error,
              }),
            ),
          ),
        );
      }),
    ),
  );

  public readonly fullNameNotification$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userUpdateActions.fullName),
        map(() => {
          this.notiicationService.show('Full name updating...', 'info');
        }),
      ),
    { dispatch: false },
  );

  public readonly fullNameNotificationSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userUpdateActions.fullNameSuccess),
        map(() => {
          this.notiicationService.show(
            'Full name updated successfully.',
            'success',
          );
        }),
      ),
    { dispatch: false },
  );

  public readonly fullNameNotificationFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userUpdateActions.fullNameFailure),
        map(() => {
          this.notiicationService.show(
            'Something went wrong. Full name not updated.',
            'error',
          );
        }),
      ),
    { dispatch: false },
  );
}
