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
import { screenshotActions } from '@ever-co/screenshot-data-access';
import { HumanizePipe } from '@ever-co/shared-service';
import {
  selectSettingStorageState,
  settingStorageActions,
} from '@ever-co/web-setting-data-access';
import { Store } from '@ngrx/store';
import { Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'lib-storage',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    HumanizePipe,
  ],
  templateUrl: './storage.component.html',
  styleUrl: './storage.component.scss',
})
export class StorageComponent implements OnInit {
  public formGroup!: FormGroup;
  public retentionPeriods = ['7', '14', '30', '90', '180', '360'];
  private destroy$ = new Subject<void>();

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      retention: new FormControl(this.retentionPeriods[0], [
        Validators.required,
      ]),
    });

    this.store
      .select(selectSettingStorageState)
      .pipe(
        tap(({ retention }) => this.formGroup.patchValue({ retention })),
        takeUntil(this.destroy$)
      )
      .subscribe();

    this.store.dispatch(settingStorageActions.load());
  }

  public onSubmit(): void {
    this.store.dispatch(settingStorageActions.update(this.formGroup.value));
  }

  public purge(): void {
    this.store.dispatch(screenshotActions.deleteScreenshots());
  }
}
