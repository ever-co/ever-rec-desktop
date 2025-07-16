import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { selectAuthLoading } from '@ever-co/auth-data-access';
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
export class ForgotPageComponent {
  emailSent = false;
  email = '';

  constructor(private readonly store: Store) {}

  public get loading$(): Observable<boolean> {
    return this.store.select(selectAuthLoading);
  }

  onEmailSubmitted(email: string) {
    this.email = email;
    this.emailSent = true;
  }

  resetForm() {
    this.emailSent = false;
    this.email = '';
  }
}
