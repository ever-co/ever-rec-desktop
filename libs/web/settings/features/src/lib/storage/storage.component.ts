import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { NotificationService } from '@ever-co/notification-data-access';
import { screenshotActions } from '@ever-co/screenshot-data-access';
import { HumanizeBytesPipe, HumanizePipe } from '@ever-co/shared-service';
import { IUsedSize } from '@ever-co/shared-utils';
import {
  selectSettingStorageState,
  settingStorageActions,
} from '@ever-co/web-setting-data-access';
import { Store } from '@ngrx/store';
import { map, Observable, Subject, takeUntil, tap } from 'rxjs';
import { AwsStorageComponent } from '../aws-storage/aws-storage.component';

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
    HumanizeBytesPipe,
    MatCardModule,
    AwsStorageComponent,
    MatStepperModule,
  ],
  templateUrl: './storage.component.html',
  styleUrl: './storage.component.scss',
})
export class StorageComponent implements OnInit, OnDestroy {
  public formGroup!: FormGroup;
  public retentionPeriods = [7, 14, 30, 90, 180, 360, -1];
  private destroy$ = new Subject<void>();
  public size$!: Observable<IUsedSize>;

  constructor(
    private readonly store: Store,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      retention: new FormControl(this.retentionPeriods[0], [
        Validators.required,
      ]),
    });

    this.size$ = this.store.select(selectSettingStorageState).pipe(
      map(({ used }) => used),
      takeUntil(this.destroy$)
    );

    this.store
      .select(selectSettingStorageState)
      .pipe(
        tap(({ retention }) => this.formGroup.patchValue({ retention })),
        takeUntil(this.destroy$)
      )
      .subscribe();

    this.store.dispatch(settingStorageActions.load());
    this.store.dispatch(settingStorageActions.getUsedSize());
  }

  public onSubmit(): void {
    this.store.dispatch(settingStorageActions.update(this.formGroup.value));
    this.notificationService.show('Retention storage updated', 'info');
  }

  public purge(): void {
    this.store.dispatch(screenshotActions.deleteScreenshots());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
