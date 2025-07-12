import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ICredentials, ILoginForm } from '@ever-co/auth-data-access';

@Component({
  selector: 'lib-signup-form',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './signup-form.component.html',
  styleUrl: './signup-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupFormComponent {
  public readonly loading = input<boolean | null>(false);
  public readonly submit = output<ICredentials>({ alias: 'signInWithEmail' });

  public readonly form = new FormGroup<ILoginForm & { confirmPassword: FormControl<string | null> }>({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.minLength(5),
      Validators.maxLength(50),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(50),
      Validators.pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      ),
    ]),
    confirmPassword: new FormControl('', [Validators.required]),
  }, { validators: [SignupFormComponent.passwordsMatchValidator] });

  public readonly showPassword = signal(false);
  public readonly showConfirmPassword = signal(false);

  public readonly passwordInputType = computed(() =>
    this.showPassword() ? 'text' : 'password'
  );

  public readonly confirmPasswordInputType = computed(() =>
    this.showConfirmPassword() ? 'text' : 'password'
  );

  // Form control getters
  public get email() { return this.form.get('email'); }
  public get password() { return this.form.get('password'); }
  public get confirmPassword() { return this.form.get('confirmPassword'); }

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
  public get passwordMaxLength() {
    return this.password?.hasError('maxlength') && this.password?.touched;
  }
  public get passwordPattern() {
    return this.password?.hasError('pattern') && this.password?.touched;
  }

  // Password strength error details
  public get passwordStrengthErrors() {
    if (this.password?.hasError('passwordStrength')) {
      return this.password.getError('passwordStrength') as {
        hasUpperCase?: boolean;
        hasLowerCase?: boolean;
        hasNumber?: boolean;
        hasSpecialChar?: boolean;
      };
    }
    return null;
  }

  // Confirm password error getters
  public get confirmPasswordRequired() {
    return this.confirmPassword?.hasError('required') && this.confirmPassword?.touched;
  }
  public get confirmPasswordMismatch() {
    return this.form.hasError('passwordsMismatch') && this.confirmPassword?.touched;
  }

  /**
   * Validates that password and confirm password fields match
   */
  private static passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const group = control as FormGroup;
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (!password || !confirmPassword) {
      return null; // Let required validator handle empty fields
    }

    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  public togglePasswordVisibility(): void {
    this.showPassword.update((v) => !v);
  }

  public toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.update((v) => !v);
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
