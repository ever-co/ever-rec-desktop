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
import {
  screenshotActions,
  selectScreenshotState,
} from '@ever-co/screenshot-data-access';
import {
  ActionButtonComponent,
  ActionButtonGroupComponent,
  ConfirmationDialogService,
} from '@ever-co/shared-components';
import { HumanizeBytesPipe, HumanizePipe } from '@ever-co/shared-service';
import { IActionButton, IUsedSize } from '@ever-co/shared-utils';
import {
  selectSettingStorageState,
  settingStorageActions,
} from '@ever-co/web-setting-data-access';
import { Store } from '@ngrx/store';
import { filter, map, Observable, Subject, take, takeUntil, tap } from 'rxjs';
import { AutoScreenshotDeletionComponent } from '../auto-screenshot-deletion/auto-screenshot-deletion.component';
import { AwsStorageComponent } from '../aws-storage/aws-storage.component';
import { UploadConfigComponent } from '../upload-config/upload-config.component';
import {
  audioActions,
  photoActions,
  selectAudioState,
  selectPhotoState,
} from '@ever-co/webcam-data-access';
import {
  selectVideoState,
  videoActions,
} from '@ever-co/convert-video-data-access';

@Component({
  selector: 'lib-storage',
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
    AutoScreenshotDeletionComponent,
    UploadConfigComponent,
    ActionButtonComponent,
    ActionButtonGroupComponent,
  ],
  templateUrl: './storage.component.html',
  styleUrl: './storage.component.scss',
})
export class StorageComponent implements OnInit, OnDestroy {
  public formGroup!: FormGroup;
  public retentionPeriods = [7, 14, 30, 90, 180, 360, -1];
  private destroy$ = new Subject<void>();
  public size$!: Observable<IUsedSize>;
  public deleteScreenshotsButton: IActionButton = {
    variant: 'danger',
    icon: 'delete',
    tooltip: 'Delete all screenshots',
    loading: this.deletingScreenshots$,
    loadingLabel: 'Deleting...',
    action: this.purgeScreenshots.bind(this),
  };

  public deletePhotosButton: IActionButton = {
    variant: 'danger',
    icon: 'delete',
    tooltip: 'Delete all photos',
    loading: this.deletingPhotos$,
    loadingLabel: 'Deleting...',
    action: this.purgePhotos.bind(this),
  };

  public deleteVideosButton: IActionButton = {
    variant: 'danger',
    icon: 'delete',
    tooltip: 'Delete all videos',
    loading: this.deletingVideos$,
    loadingLabel: 'Deleting...',
    action: this.purgeVideos.bind(this),
  };

  public deleteAudiosButton: IActionButton = {
    variant: 'danger',
    icon: 'delete',
    tooltip: 'Delete all audios',
    loading: this.deletingAudios$,
    loadingLabel: 'Deleting...',
    action: this.purgeAudios.bind(this),
  };

  public retentionButtons: IActionButton[] = [
    {
      variant: 'success',
      icon: 'save',
      label: 'Save',
      tooltip: 'Save',
      type: 'submit',
    },
    {
      variant: 'danger',
      icon: 'delete',
      label: 'Purge',
      loading: this.purging$,
      loadingLabel: 'Purging...',
      tooltip: 'Delete all stored data',
      action: this.purge.bind(this),
    },
  ];

  constructor(
    private readonly store: Store,
    private readonly notificationService: NotificationService,
    private readonly confirmationDialogService: ConfirmationDialogService
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
    this.confirmationDialogService
      .open({
        title: 'Delete All Stored Data?',
        message: `This action will permanently delete all stored data and cannot be undone. Are you sure you wish to proceed?`,
        variant: 'danger',
      })
      .pipe(
        take(1),
        filter(Boolean),
        tap(() => this.store.dispatch(screenshotActions.purge())),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  public purgePhotos(): void {
    this.confirmationDialogService
      .open({
        title: 'Delete All Stored Photos',
        message: `This action will permanently delete all stored photos and cannot be undone. Are you sure you wish to proceed?`,
        variant: 'danger',
      })
      .pipe(
        take(1),
        filter(Boolean),
        tap(() => this.store.dispatch(photoActions.deletePhotos())),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  public purgeAudios(): void {
    this.confirmationDialogService
      .open({
        title: 'Delete All Stored Audios',
        message: `This action will permanently delete all stored audios and cannot be undone. Are you sure you wish to proceed?`,
        variant: 'danger',
      })
      .pipe(
        take(1),
        filter(Boolean),
        tap(() => this.store.dispatch(audioActions.deleteAudios())),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  public purgeVideos(): void {
    this.confirmationDialogService
      .open({
        title: 'Delete All Stored Videos',
        message: `This action will permanently delete all stored videos and cannot be undone. Are you sure you wish to proceed?`,
        variant: 'danger',
      })
      .pipe(
        take(1),
        filter(Boolean),
        tap(() => this.store.dispatch(videoActions.deleteVideos({}))),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  public purgeScreenshots(): void {
    this.confirmationDialogService
      .open({
        title: 'Delete All Stored Screenshots',
        message: `This action will permanently delete all stored screenshots and cannot be undone. Are you sure you wish to proceed?`,
        variant: 'danger',
      })
      .pipe(
        take(1),
        filter(Boolean),
        tap(() =>
          this.store.dispatch(screenshotActions.deleteSelectedScreenshots({}))
        ),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  public get deletingPhotos$(): Observable<boolean> {
    return this.store
      .select(selectPhotoState)
      .pipe(map((state) => state.deleting));
  }

  public get deletingVideos$(): Observable<boolean> {
    return this.store
      .select(selectVideoState)
      .pipe(map((state) => state.deleting));
  }

  public get deletingScreenshots$(): Observable<boolean> {
    return this.store
      .select(selectScreenshotState)
      .pipe(map((state) => state.deleting));
  }

  public get deletingAudios$(): Observable<boolean> {
    return this.store
      .select(selectAudioState)
      .pipe(map((state) => state.deleting));
  }

  public get purging$(): Observable<boolean> {
    return this.store
      .select(selectScreenshotState)
      .pipe(map((state) => state.purging));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
