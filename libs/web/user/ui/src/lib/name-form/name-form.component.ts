import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActionButtonComponent } from '@ever-co/shared-components';
import { IActionButton } from '@ever-co/shared-utils';
import { IFullName, IFullNameForm } from '@ever-co/user-data-access';
import { map } from 'rxjs';

@Component({
  selector: 'lib-name-form',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ActionButtonComponent,
  ],
  templateUrl: './name-form.component.html',
  styleUrl: './name-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NameFormComponent {
  public readonly name = input<string | null>('');
  public readonly loading = input<boolean | null>(false);
  public readonly submit = output<IFullName>({ alias: 'nameChange' });

  public form!: FormGroup;

  public readonly buttonSubmit: IActionButton = {
    icon: 'save_as',
    label: 'Update your full name',
    type: 'submit',
    loading: toObservable(this.loading).pipe(map(Boolean)),
  };

  ngOnInit(): void {
    this.form = new FormGroup<IFullNameForm>({
      fullName: new FormControl(this.name(), [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
      ]),
    });
  }

  // Form control getters
  public get fullName() {
    return this.form.get('fullName');
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

  public submitForm(): void {
    if (this.form.valid) {
      const { fullName } = this.form.value;
      this.submit.emit({ fullName });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
