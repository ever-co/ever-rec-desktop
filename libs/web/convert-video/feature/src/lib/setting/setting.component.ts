import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'lib-setting',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.scss',
})
export class SettingComponent implements OnInit {
  public formGroup!: FormGroup;

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      frameRate: new FormControl('30', Validators.required),
      patternType: new FormControl('glob', Validators.required),
      width: new FormControl('auto', [
        Validators.required,
        this.validateAutoOrNumber,
      ]),
      height: new FormControl('auto', [
        Validators.required,
        this.validateAutoOrNumber,
      ]),
      imageFormat: new FormControl('png', Validators.required),
      videoFormat: new FormControl('mp4', Validators.required),
    });
  }

  private validateAutoOrNumber(
    control: FormControl
  ): { [key: string]: boolean } | null {
    const value = control.value;
    return value === 'auto' || !isNaN(parseInt(value, 10))
      ? null
      : { invalidValue: true };
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      const formData = this.formGroup.value;
      console.log('Form Data:', formData);
      // Add your form submission logic here
      // For example, send the form data to a server
    } else {
      this.formGroup.markAllAsTouched(); // Mark all fields as touched to show validation errors
      console.log('Form is invalid');
    }
  }
}
