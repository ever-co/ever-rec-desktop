import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'lib-screenshot-setting',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.scss',
})
export class SettingComponent implements OnInit {
  public formGroup!: FormGroup;
  public sources = ['windows', 'screen'];

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      period: new FormControl('2', [Validators.required, Validators.min(1)]),
      source: new FormControl(this.sources[0], [Validators.required]),
    });
  }

  public onSubmit(): void {
    // TODO!!!
  }
}
