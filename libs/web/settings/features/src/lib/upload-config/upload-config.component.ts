import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';
import { NotificationService } from '@ever-co/notification-data-access';
import { IUploadConfigForm } from '@ever-co/shared-utils';
import {
  selectSettingStorageState,
  settingStorageActions,
} from '@ever-co/web-setting-data-access';
import { Store } from '@ngrx/store';
import { Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'lib-upload-config',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSlideToggleModule,
  ],
  templateUrl: './upload-config.component.html',
  styleUrl: './upload-config.component.scss',
})
export class UploadConfigComponent implements OnInit, OnDestroy {
  public form!: FormGroup;
  private destroy$ = new Subject<void>();

  constructor(
    private readonly store: Store,
    private readonly notificationService: NotificationService
  ) {
    this.form = new FormGroup<IUploadConfigForm>({
      autoSync: new FormControl(false),
      manualSync: new FormControl(false),
    });
  }
  ngOnInit(): void {
    this.store
      .select(selectSettingStorageState)
      .pipe(
        tap(({ uploadConfig }) => {
          this.form.patchValue(uploadConfig);
          this.onCheck({ checked: uploadConfig.autoSync });
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  public onCheck({ checked }: Partial<MatSlideToggleChange>) {
    if (checked) {
      this.form.controls['manualSync'].enable();
    } else {
      this.form.controls['manualSync'].disable();
    }
  }

  public onSubmit(): void {
    this.store.dispatch(
      settingStorageActions.update({ uploadConfig: this.form.value })
    );
    this.notificationService.show('Upload configuration updated', 'info');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
