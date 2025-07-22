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
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActionButtonComponent } from '@ever-co/shared-components';
import { IActionButton } from '@ever-co/shared-utils';
import { IPassword, IPasswordForm } from '@ever-co/user-data-access';

export interface IPasswordConfig {
  submit?: Partial<IActionButton>;
  cancel?: Partial<IActionButton>;
  showCancel?: boolean;
}

@Component({
  selector: 'lib-password-form',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ActionButtonComponent,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './password-form.component.html',
  styleUrl: './password-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordFormComponent {
  public readonly config = input<IPasswordConfig>();
  public readonly input = input<string | null>('');
  public readonly submit = output<IPassword>({ alias: 'passwordChange' });

  public form!: FormGroup<IPasswordForm>;

  public buttonSubmit!: IActionButton;

  public buttonCancel!: IActionButton;

  public readonly showPassword = signal(false);

  public readonly passwordInputType = computed(() =>
    this.showPassword() ? 'text' : 'password',
  );

  ngOnInit(): void {
    this.form = new FormGroup({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(50),
        Validators.pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        ),
      ]),
    });

    this.buttonSubmit = {
      icon: 'save_as',
      label: 'Update your password',
      type: 'submit',
      ...this.config()?.submit,
    };

    this.buttonCancel = {
      icon: 'close',
      type: 'reset',
      label: 'Cancel',
      variant: 'danger',
      ...this.config()?.cancel,
    };
  }

  // Form control getters
  public get password() {
    return this.form.get('password');
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

  public togglePasswordVisibility(): void {
    this.showPassword.update((v) => !v);
  }

  public submitForm(): void {
    if (this.form.valid) {
      const { password } = this.form.value as IPassword;
      const trimmed = password.trim();
      this.submit.emit({ password: trimmed });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
