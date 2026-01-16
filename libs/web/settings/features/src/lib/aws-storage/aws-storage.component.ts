
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NotificationService } from '@ever-co/notification-data-access';
import { urlValidator } from '@ever-co/shared-service';
import { IS3ConfigForm } from '@ever-co/shared-utils';
import {
  selectSettingStorageState,
  settingStorageActions,
} from '@ever-co/web-setting-data-access';
import { Store } from '@ngrx/store';
import { Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'lib-aws-storage',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSlideToggleModule
  ],
  templateUrl: './aws-storage.component.html',
  styleUrl: './aws-storage.component.scss'
})
export class AwsStorageComponent implements OnInit, OnDestroy {
  public form!: FormGroup;
  private destroy$ = new Subject<void>();

  constructor(
    private readonly store: Store,
    private readonly notificationService: NotificationService
  ) {
    this.form = new FormGroup<IS3ConfigForm>({
      accessKeyId: new FormControl('', [Validators.required]),
      accessKeySecret: new FormControl('', [Validators.required]),
      region: new FormControl('', [Validators.required]),
      s3Endpoint: new FormControl('', [urlValidator()]),
      s3Bucket: new FormControl('', [Validators.required]),
      enabled: new FormControl(false)
    });
  }
  ngOnInit(): void {
    this.store
      .select(selectSettingStorageState)
      .pipe(
        tap(({ s3Config }) => this.form.patchValue(s3Config)),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  public onSubmit(): void {
    this.store.dispatch(
      settingStorageActions.update({ s3Config: this.form.value })
    );
    this.notificationService.show('AWS S3 config storage updated', 'info');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
