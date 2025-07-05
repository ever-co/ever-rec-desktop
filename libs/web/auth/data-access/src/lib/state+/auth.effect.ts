import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, defer, exhaustMap, from, map, of, switchMap } from 'rxjs';
import { UserAdapter } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { authActions } from './auth.action';
import { UserCredential } from '@angular/fire/auth';

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly authService = inject(AuthService);

  private handleAuthSuccess(credentials: UserCredential) {
    const adapter = new UserAdapter(credentials.user);
    const user = adapter.clone();
    return from(credentials.user.getIdTokenResult()).pipe(
      map(({ token, expirationTime }) =>
        authActions.loginSuccess({
          user,
          token,
          expiresAt: expirationTime,
        }),
      ),
    );
  }

  private handleAuthError(error: string) {
    return of(authActions.loginFailure({ error }));
  }

  public readonly signIn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.login),
      exhaustMap(({ credentials: { email, password } }) =>
        defer(() => this.authService.signIn(email, password)).pipe(
          switchMap(this.handleAuthSuccess),
          catchError(this.handleAuthError),
        ),
      ),
    ),
  );

  public readonly signInWithGoogle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.loginWithGoogle),
      exhaustMap(() =>
        defer(() => this.authService.signInWithGoogle()).pipe(
          switchMap(this.handleAuthSuccess),
          catchError(this.handleAuthError),
        ),
      ),
    ),
  );

  public readonly signOut$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.logout),
      exhaustMap(() =>
        defer(() => this.authService.signOut()).pipe(
          map(() => authActions.logoutSuccess()),
          catchError((error) => of(authActions.logoutFailure({ error }))),
        ),
      ),
    ),
  );
}
