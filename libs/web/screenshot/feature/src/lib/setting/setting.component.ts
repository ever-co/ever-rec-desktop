import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { selectSettingScreenCaptureState, settingScreenCaptureActions } from '@ever-co/screenshot-data-access';
import { Source } from '@ever-co/shared-utils';
import { Store } from '@ngrx/store';
import { Subject, takeUntil, tap } from 'rxjs';

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
export class SettingComponent implements OnInit, OnDestroy {
  public formGroup!: FormGroup;
  public sources = Object.values(Source);
  private destroy$ = new Subject<void>();

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      period: new FormControl('2', [Validators.required, Validators.min(1)]),
      source: new FormControl(this.sources[0], [Validators.required]),
    });

    this.store
      .select(selectSettingScreenCaptureState)
      .pipe(
        tap((state) => this.formGroup.patchValue(state.screenCaptureConfig)),
        takeUntil(this.destroy$)
      )
      .subscribe();

    this.store.dispatch(settingScreenCaptureActions.load());
  }

  public onSubmit(): void {
    this.store.dispatch(
      settingScreenCaptureActions.update({
        screenCaptureConfig: this.formGroup.value,
      })
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
