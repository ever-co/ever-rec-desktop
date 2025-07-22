import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
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
import { map } from 'rxjs';

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
  public readonly input = input<string | null>('');
  public readonly loading = input<boolean | null>(false);
  public readonly submit = output<any>({ alias: 'signUpWithEmail' });

  public form!: FormGroup;

  public readonly buttonSubmit: IActionButton = {
    icon: 'save_as',
    label: 'Update your password',
    type: 'submit',
    loading: toObservable(this.loading).pipe(map(Boolean)),
  };

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
      const { password } = this.form.value;
      const trimmed = password.trim();
      this.submit.emit({ password: trimmed });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
