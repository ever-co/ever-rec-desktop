
import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
  output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'lib-forgot-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule
],
  templateUrl: './forgot-form.component.html',
  styleUrl: './forgot-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotFormComponent implements OnInit {
  public readonly loading = input<boolean | null>(false);
  public readonly submit = output<string>({ alias: 'emailSubmitted' });
  public form!: FormGroup;

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.minLength(5),
        Validators.maxLength(50),
      ]),
    });
  }

  // Form control getter
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

  public submitForm(): void {
    if (this.form.valid) {
      const { email } = this.form.value;
      this.submit.emit(email);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
