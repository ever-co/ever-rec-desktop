import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import {
  authActions,
  selectAuthLoading,
  selectEmail,
  selectEmailSent,
} from '@ever-co/auth-data-access';
import { AuthContainerComponent, ForgotFormComponent } from '@ever-co/auth-ui';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'lib-forgot-page',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    AuthContainerComponent,
    ForgotFormComponent,
  ],
  templateUrl: './forgot-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPageComponent implements OnDestroy {
  constructor(
    private readonly store: Store,
    private readonly router: Router,
  ) {}

  public get emailSent$(): Observable<boolean> {
    return this.store.select(selectEmailSent);
  }

  public get email$(): Observable<string> {
    return this.store.select(selectEmail);
  }

  public get loading$(): Observable<boolean> {
    return this.store.select(selectAuthLoading);
  }

  public onEmailSubmitted(email: string) {
    this.store.dispatch(authActions.resetPassword({ email }));
  }

  public resetForm() {
    this.store.dispatch(authActions.resetForm());
  }

  public returnToLogin(): void {
    this.router.navigateByUrl('/auth/login');
  }

  ngOnDestroy(): void {
    this.resetForm();
  }
}
