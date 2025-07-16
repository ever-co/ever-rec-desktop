import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  authActions,
  ICredentials,
  selectAuthLoading,
} from '@ever-co/auth-data-access';
import { AuthContainerComponent, LoginFormComponent } from '@ever-co/auth-ui';
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
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  public readonly isGoogle = signal<boolean>(false);

  constructor(private readonly store: Store) {}

  public signInWithGoogle() {
    this.isGoogle.update(() => true);
    this.store.dispatch(authActions.loginWithGoogle());
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
}
