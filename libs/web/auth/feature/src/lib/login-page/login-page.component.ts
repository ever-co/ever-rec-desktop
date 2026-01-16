import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import {
  authActions,
  ICredentials,
  ILoginGoogle,
  selectAuthLoading,
} from '@ever-co/auth-data-access';
import {
  AuthContainerComponent,
  GoogleButtonComponent,
  LoginFormComponent,
} from '@ever-co/auth-ui';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'lib-login-page',
  imports: [
    CommonModule,
    LoginFormComponent,
    MatIconModule,
    MatProgressSpinnerModule,
    AuthContainerComponent,
    GoogleButtonComponent,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  public readonly isGoogle = signal<boolean>(false);

  constructor(
    private readonly store: Store,
    private readonly router: Router,
  ) {}

  public signInWithGoogle(event: ILoginGoogle) {
    this.isGoogle.update(() => true);
    this.store.dispatch(authActions.loginWithGoogle(event));
  }

  public get loading$(): Observable<boolean> {
    return this.store.select(selectAuthLoading);
  }

  public signInWithEmail(event: ICredentials) {
    this.isGoogle.update(() => false);
    this.store.dispatch(
      authActions.login({ credentials: event, rememberMe: false }),
    );
  }

  public forgotPassword(): void {
    this.router.navigateByUrl('/auth/forgot-password');
  }
}
