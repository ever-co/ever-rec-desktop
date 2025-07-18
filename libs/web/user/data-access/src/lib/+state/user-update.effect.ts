import { inject, Injectable } from '@angular/core';
import {
  authActions,
  AuthService,
  UserAdapter,
} from '@ever-co/auth-data-access';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, from, map, of, switchMap } from 'rxjs';
import { userUpdateActions } from './user-update.action';

@Injectable()
export class UserUpdateEffects {
  private readonly actions$ = inject(Actions);
  private readonly authService = inject(AuthService);

  public readonly profile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userUpdateActions.fullNameSuccess),
      switchMap(({ user }) =>
        from(user.reload()).pipe(
          map(() => {
            const adapter = new UserAdapter(user);
            return authActions.updateProfile({ user: adapter.clone() });
          }),
        ),
      ),
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
          map(() => userUpdateActions.fullNameSuccess({ user })),
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
}
