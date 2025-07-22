import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  AbstractControlOptions,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActionButtonComponent } from '@ever-co/shared-components';
import { IActionButton } from '@ever-co/shared-utils';
import { IEmail, IEmailForm } from '@ever-co/user-data-access';
import { map } from 'rxjs';

@Component({
  selector: 'lib-email-form',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ActionButtonComponent,
  ],
  templateUrl: './email-form.component.html',
  styleUrl: './email-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailFormComponent {
  public readonly input = input<string | null>('');
  public readonly loading = input<boolean | null>(false);
  public readonly submit = output<IEmail>({ alias: 'emailChange' });

  public form!: FormGroup<IEmailForm>;

  public readonly buttonSubmit: IActionButton = {
    icon: 'save_as',
    label: 'Update your email',
    type: 'submit',
    loading: toObservable(this.loading).pipe(map(Boolean)),
  };

  ngOnInit(): void {
    this.form = new FormGroup<IEmailForm>({
      email: new FormControl(this.input(), [
        Validators.required,
        Validators.email,
        Validators.minLength(5),
        Validators.maxLength(50),
        this.sameEmailValidator(this.input()),
      ]),
    });
  }

  private sameEmailValidator(original: string | null) {
    return (control: AbstractControlOptions): ValidationErrors | null => {
      const email = control as FormControl;
      const current = email?.value?.trim();

      if (current === original) {
        return { sameValue: true };
      }

      return null;
    };
  }

  // Form control getters
  public get email() {
    return this.form.get('email');
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
  public get emailSameValue() {
    return this.email?.hasError('sameValue') && this.email?.touched;
  }

  public submitForm(): void {
    if (this.form.valid) {
      const { email } = this.form.value as IEmail;
      const trimmed = email.trim();
      this.submit.emit({ email: trimmed });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
