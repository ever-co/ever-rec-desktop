import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { photoActions, selectPhotoState } from '@ever-co/photo-data-access';
import {
  ActionButtonGroupComponent,
  ConfirmationDialogService,
  NoDataComponent,
} from '@ever-co/shared-components';
import {
  HumanizeBytesPipe,
  ImgFallbackDirective,
  PopoverDirective,
  UtcToLocalTimePipe,
} from '@ever-co/shared-service';
import { IActionButton, IPhoto } from '@ever-co/shared-utils';
import {
  selectUploadInProgress,
  uploadActions,
  UploadPhotoItem,
} from '@ever-co/upload-data-access';
import { selectSettingStorageState } from '@ever-co/web-setting-data-access';
import { Store } from '@ngrx/store';
import {
  filter,
  lastValueFrom,
  map,
  Observable,
  Subject,
  take,
  takeUntil,
  tap,
} from 'rxjs';

@Component({
  selector: 'lib-photo',
  imports: [
    CommonModule,
    NoDataComponent,
    UtcToLocalTimePipe,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    HumanizeBytesPipe,
    PopoverDirective,
    ActionButtonGroupComponent,
    ImgFallbackDirective,
    MatTooltipModule,
  ],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
})
export class DetailComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  public actionButtons: IActionButton[] = [];

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly store: Store,
    private readonly confirmationDialogService: ConfirmationDialogService,
  ) {
    this.actionButtons = [
      {
        label: 'Upload',
        variant: 'success',
        icon: 'backup',
        action: this.upload.bind(this),
        loading: this.uploading$,
        loadingLabel: 'Uploading...',
        disable: this.uploading$,
        hide: this.isUploadHidden$,
      },
      {
        icon: 'delete',
        label: 'Delete',
        variant: 'danger',
        action: this.delete.bind(this),
      },
    ];
  }

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        filter(Boolean),
        tap(async (params) => {
          if (params['id']) {
            this.store.dispatch(
              photoActions.loadPhoto({
                where: {
                  id: params['id'],
                },
                relations: ['metadata'],
              }),
            );
          } else {
            await this.router.navigate(['/dashboard']);
          }
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  public get photo$(): Observable<IPhoto | null> {
    return this.store.select(selectPhotoState).pipe(
      map((state) => state.photo),
      takeUntil(this.destroy$),
    );
  }

  public get isLoading$(): Observable<boolean> {
    return this.store.select(selectPhotoState).pipe(
      map((state) => state.loading),
      takeUntil(this.destroy$),
    );
  }

  public async delete(photo: IPhoto) {
    const isConfirmed = await lastValueFrom(
      this.confirmationDialogService.open({
        title: 'Delete Photo',
        message: 'Are you sure you want to delete this photo?',
        variant: 'danger',
      }),
    );
    if (isConfirmed) {
      this.store.dispatch(photoActions.deletePhoto(photo));
      await this.router.navigate(['/', 'library', 'photos']);
    }
  }

  private get uploading$(): Observable<boolean> {
    return this.store
      .select(selectUploadInProgress)
      .pipe(takeUntil(this.destroy$));
  }

  private get isUploadHidden$(): Observable<boolean> {
    return this.store.select(selectSettingStorageState).pipe(
      map(({ uploadConfig }) => !uploadConfig.manualSync),
      takeUntil(this.destroy$),
    );
  }

  private upload(photo: IPhoto): void {
    this.confirmationDialogService
      .open({
        title: 'Upload Photo',
        message: `Are you sure you want to upload this photo?`,
        variant: 'primary',
        button: {
          confirm: {
            label: 'Upload',
            variant: 'success',
            icon: 'backup',
          },
        },
      })
      .pipe(
        take(1),
        filter(Boolean),
        tap(() =>
          this.store.dispatch(
            uploadActions.addItemToQueue({ item: new UploadPhotoItem(photo) }),
          ),
        ),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
