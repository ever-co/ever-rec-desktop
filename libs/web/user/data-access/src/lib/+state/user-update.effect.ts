import { inject, Injectable } from '@angular/core';
import {
  authActions,
  AuthService,
  selectUser,
} from '@ever-co/auth-data-access';
import { NotificationService } from '@ever-co/notification-data-access';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ResStatusEnum } from 'libs/web/auth/data-access/src/lib/models/auth.model';
import {
  catchError,
  exhaustMap,
  from,
  map,
  of,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { userUpdateActions } from './user-update.action';

@Injectable()
export class UserUpdateEffects {
  private readonly actions$ = inject(Actions);
  private readonly authService = inject(AuthService);
  private readonly store = inject(Store);
  private readonly notificationService = inject(NotificationService);

  public readonly profile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        userUpdateActions.fullNameSuccess,
        userUpdateActions.emailSuccess,
        userUpdateActions.uploadAvatarSuccess,
      ),
      map((user) => authActions.updateProfile({ user })),
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

        return from(this.authService.updateProfile({ fullName })).pipe(
          map(({ data }) =>
            userUpdateActions.fullNameSuccess({
              name: data.displayName,
            }),
          ),
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
          this.notificationService.show('Full name updating...', 'info');
        }),
      ),
    { dispatch: false },
  );

  public readonly fullNameNotificationSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userUpdateActions.fullNameSuccess),
        map(() => {
          this.notificationService.show(
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
          this.notificationService.show(
            'Something went wrong. Full name not updated.',
            'error',
          );
        }),
      ),
    { dispatch: false },
  );

  public readonly updateEmail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userUpdateActions.email),
      withLatestFrom(this.store.select(selectUser)),
      exhaustMap(([{ password, email: newEmail }, user]) => {
        // Early validation
        if (!user?.email) {
          return of(
            userUpdateActions.emailFailure({
              error: 'User not authenticated',
            }),
          );
        }

        // Prepare request data
        const authCredentials = {
          password,
          email: user.email,
        };

        return this.authService.reauthenticate(authCredentials).pipe(
          switchMap(() => this.authService.updateEmail(newEmail)),
          map((response) => {
            if (response.status === ResStatusEnum.error) {
              return userUpdateActions.emailFailure({
                error: response.message || 'Failed to update email',
              });
            }
            return userUpdateActions.emailSuccess(response.data);
          }),
          catchError((error) => {
            return of(
              userUpdateActions.emailFailure({
                error: error.message || 'Wrong password',
              }),
            );
          }),
        );
      }),
      catchError((error) => {
        return of(
          userUpdateActions.emailFailure({
            error: error.message || 'Failed to update email',
          }),
        );
      }),
    ),
  );

  public readonly emailNotification$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userUpdateActions.email),
        tap(() => {
          this.notificationService.show('Email updating...', 'info');
        }),
      ),
    { dispatch: false },
  );

  public readonly emailNotificationSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userUpdateActions.emailSuccess),
        tap(() => {
          this.notificationService.show(
            'Email updated successfully.',
            'success',
          );
        }),
      ),
    { dispatch: false },
  );

  public readonly emailNotificationFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userUpdateActions.emailFailure),
        tap(() => {
          this.notificationService.show(
            'Something went wrong. Email not updated.',
            'error',
          );
        }),
      ),
    { dispatch: false },
  );

  public readonly updatePassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userUpdateActions.password),
      withLatestFrom(this.store.select(selectUser)),
      exhaustMap(([{ password, oldPassword }, user]) => {
        if (!user?.email) {
          return of(
            userUpdateActions.passwordFailure({
              error: 'User email not available',
            }),
          );
        }

        const credentials = {
          password: oldPassword,
          email: user.email,
        };
        const updateData = {
          oldPassword,
          password,
          email: user.email,
        };

        return this.authService.reauthenticate(credentials).pipe(
          switchMap(() => this.authService.updatePassword(updateData)),
          map(({ data, status, message }) => {
            if (status === ResStatusEnum.error) {
              return userUpdateActions.passwordFailure({ error: message });
            }
            return userUpdateActions.passwordSuccess();
          }),
          catchError((error) => {
            const errorMessage = error.message ?? 'Failed to update password';
            return of(
              userUpdateActions.passwordFailure({ error: errorMessage }),
            );
          }),
        );
      }),
      catchError((error) => {
        const errorMessage = error.message ?? 'An unexpected error occurred';
        return of(userUpdateActions.passwordFailure({ error: errorMessage }));
      }),
    ),
  );

  public readonly passwordNotification$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userUpdateActions.password),
        tap(() => {
          this.notificationService.show('Password updating...', 'info');
        }),
      ),
    { dispatch: false },
  );

  public readonly passwordNotificationSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userUpdateActions.passwordSuccess),
        tap(() => {
          this.notificationService.show(
            'Password updated successfully.',
            'success',
          );
        }),
      ),
    { dispatch: false },
  );

  public readonly passwordNotificationFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userUpdateActions.passwordFailure),
        tap(() => {
          this.notificationService.show(
            'Something went wrong. Password not updated.',
            'error',
          );
        }),
      ),
    { dispatch: false },
  );

  public readonly updateAvatar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userUpdateActions.uploadAvatar),
      exhaustMap(({ file }) => {
        if (!file) {
          return of(
            userUpdateActions.uploadAvatarFailure({
              error: 'No file provided',
            }),
          );
        }

        return this.authService.uploadAvatar(file).pipe(
          map(({ data, status, message }) => {
            if (status === ResStatusEnum.error) {
              return userUpdateActions.uploadAvatarFailure({ error: message });
            }

            return userUpdateActions.uploadAvatarSuccess({
              imageUrl: data.photoURL,
            });
          }),
          catchError((error) =>
            of(
              userUpdateActions.uploadAvatarFailure({
                error: error.message || 'Failed to upload avatar',
              }),
            ),
          ),
        );
      }),
    ),
  );

  public readonly uploadAvatarNotification$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userUpdateActions.uploadAvatar),
        tap(() => {
          this.notificationService.show('Avatar uploading...', 'info');
        }),
      ),
    { dispatch: false },
  );

  public readonly uploadAvatarNotificationSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userUpdateActions.uploadAvatarSuccess),
        tap(() => {
          this.notificationService.show(
            'Avatar updated successfully.',
            'success',
          );
        }),
      ),
    { dispatch: false },
  );

  public readonly uploadAvatarNotificationFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userUpdateActions.uploadAvatarFailure),
        tap(() => {
          this.notificationService.show(
            'Something went wrong. Avatar not updated.',
            'error',
          );
        }),
      ),
    { dispatch: false },
  );
}
