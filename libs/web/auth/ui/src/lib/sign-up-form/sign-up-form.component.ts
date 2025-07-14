import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ISignUp, ISignUpForm } from '@ever-co/auth-data-access';

@Component({
  selector: 'lib-sign-up-form',
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
  templateUrl: './sign-up-form.component.html',
  styleUrl: './sign-up-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpFormComponent implements OnInit {
  public readonly loading = input<boolean | null>(false);
  public readonly submit = output<ISignUp>({ alias: 'signUpWithEmail' });
  public readonly termsAndConditions = output<void>();
  public readonly privacyPolicy = output<void>();

  public form!: FormGroup<ISignUpForm>;
  public readonly showPassword = signal(false);
  public readonly showConfirmPassword = signal(false);

  public readonly passwordInputType = computed(() =>
    this.showPassword() ? 'text' : 'password',
  );

  public readonly confirmPasswordInputType = computed(() =>
    this.showConfirmPassword() ? 'text' : 'password',
  );

  ngOnInit(): void {
    this.form = new FormGroup<ISignUpForm>(
      {
        fullName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ]),
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
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          ),
        ]),
        confirmPassword: new FormControl('', [Validators.required]),
        agreed: new FormControl(false, [Validators.requiredTrue]),
      },
      { validators: [this.passwordsMatchValidator] },
    );

    this.password?.valueChanges.subscribe(() => {
      if (this.confirmPassword?.value) {
        this.form.updateValueAndValidity();
      }
    });
  }

  // Form control getters
  public get fullName() {
    return this.form.get('fullName');
  }
  public get email() {
    return this.form.get('email');
  }
  public get password() {
    return this.form.get('password');
  }
  public get confirmPassword() {
    return this.form.get('confirmPassword');
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

  // FullName error getters
  public get fullNameRequired() {
    return this.fullName?.hasError('required') && this.fullName?.touched;
  }
  public get fullNameMinLength() {
    return this.fullName?.hasError('minlength') && this.fullName?.touched;
  }
  public get fullNameMaxLength() {
    return this.fullName?.hasError('maxlength') && this.fullName?.touched;
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
    return (
      this.confirmPassword?.hasError('required') &&
      this.confirmPassword?.touched &&
      this.confirmPassword?.dirty
    );
  }

  public get confirmPasswordMismatch() {
    return (
      this.confirmPassword?.hasError('passwordsMismatch') &&
      this.confirmPassword?.touched &&
      this.confirmPassword?.dirty
    );
  }

  public onConfirmPasswordInput(): void {
    if (this.confirmPassword?.value === '') {
      // If field is empty, just set required error
      this.confirmPassword?.setErrors({ required: true });
    } else {
      // Otherwise trigger validation
      this.form.updateValueAndValidity();
    }
  }

  /**
   * Validates that password and confirm password fields match
   */
  private passwordsMatchValidator(
    control: AbstractControl,
  ): ValidationErrors | null {
    const group = control as FormGroup;
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');

    // Don't validate if either field is empty (let required validator handle that)
    if (!password?.value || !confirmPassword?.value) {
      return null;
    }

    // Clear previous mismatch error if values now match
    if (password.value === confirmPassword.value) {
      confirmPassword.setErrors(null);
      return null;
    }

    // Set mismatch error
    confirmPassword.setErrors({ passwordsMismatch: true });
    return { passwordsMismatch: true };
  }

  public togglePasswordVisibility(): void {
    this.showPassword.update((v) => !v);
  }

  public toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.update((v) => !v);
  }

  public openTermsAndConditions(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.termsAndConditions.emit();
  }

  public openPrivacyPolicy(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.privacyPolicy.emit();
  }

  public submitForm(): void {
    if (this.form.valid) {
      const { email, password, fullName } = this.form.value as ISignUp;
      this.submit.emit({ email, password, fullName });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
