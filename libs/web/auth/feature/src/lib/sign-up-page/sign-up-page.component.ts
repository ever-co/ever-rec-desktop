import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  authActions,
  ISignUp,
  selectAuthLoading,
} from '@ever-co/auth-data-access';
import { AuthContainerComponent, SignUpFormComponent } from '@ever-co/auth-ui';
import { REC_ENV } from '@ever-co/shared-service';
import { IEnvironment } from '@ever-co/shared-utils';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'lib-sign-up-page',
  imports: [
    CommonModule,
    SignUpFormComponent,
    MatIconModule,
    MatProgressSpinnerModule,
    AuthContainerComponent,
  ],
  templateUrl: './sign-up-page.component.html',
  styleUrl: './sign-up-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpPageComponent {
  public readonly isGoogle = signal<boolean>(false);

  constructor(
    @Inject(REC_ENV) public env: IEnvironment,
    private readonly store: Store,
  ) {}

  public signUpWithGoogle() {
    this.isGoogle.update(() => true);
    this.store.dispatch(authActions.loginWithGoogle());
  }

  public get loading$(): Observable<boolean> {
    return this.store.select(selectAuthLoading);
  }

  public signUpWithEmail(payload: ISignUp) {
    this.isGoogle.update(() => false);
    this.store.dispatch(authActions.signUp(payload));
  }
}
