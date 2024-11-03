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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NotificationService } from '@ever-co/notification-data-access';
import {
  selectSettingScreenCaptureState,
  settingScreenCaptureActions,
} from '@ever-co/screenshot-data-access';
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
    MatSlideToggleModule,
  ],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.scss',
})
export class SettingComponent implements OnInit, OnDestroy {
  public formGroup!: FormGroup;
  public sources = Object.values(Source);
  private destroy$ = new Subject<void>();

  constructor(
    private readonly store: Store,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      period: new FormControl('2', [Validators.required, Validators.min(1)]),
      source: new FormControl(this.sources[0], [Validators.required]),
      captureAll: new FormControl(false),
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
    this.notificationService.show(
      'Screenshot capture settings updated.',
      'info'
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
