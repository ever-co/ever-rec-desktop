import {
  ChangeDetectionStrategy,
  Component,
  output,
  signal,
  computed,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ILoginForm } from '../models/login.model';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { ICredentials } from '@ever-co/auth-data-access';

@Component({
  selector: 'lib-login-form',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatDividerModule,
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent {
  public readonly submit = output<ICredentials>();

  public readonly form = new FormGroup<ILoginForm>({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.minLength(5),
      Validators.maxLength(50),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=]{8,}$/,
      ),
    ]),
  });

  public readonly showPassword = signal(false);

  public readonly passwordInputType = computed(() =>
    this.showPassword() ? 'text' : 'password',
  );

  public get email() {
    return this.form.get('email');
  }

  public get password() {
    return this.form.get('password');
  }

  // Email error getters
  public get emailRequired() {
    return this.email?.hasError('required') && this.email?.touched;
  }
  public get emailInvalid() {
    return this.email?.hasError('email') && this.email?.touched;
  }
  public get emailMinLength() {
    return this.email?.hasError('minlength') && this.email?.touched;
  }
  public get emailMaxLength() {
    return this.email?.hasError('maxlength') && this.email?.touched;
  }

  // Password error getters
  public get passwordRequired() {
    return this.password?.hasError('required') && this.password?.touched;
  }
  public get passwordMinLength() {
    return this.password?.hasError('minlength') && this.password?.touched;
  }
  public get passwordPattern() {
    return this.password?.hasError('pattern') && this.password?.touched;
  }

  public togglePasswordVisibility(): void {
    this.showPassword.update((v) => !v);
  }

  public submitForm(): void {
    if (this.form.valid) {
      const { email, password } = this.form.value as ICredentials;
      this.submit.emit({ email, password });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
