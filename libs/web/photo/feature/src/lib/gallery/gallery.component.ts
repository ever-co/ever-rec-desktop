import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';

import { PhotoComponent } from '@ever-co/photo-ui';

import { photoActions, selectPhotoState } from '@ever-co/photo-data-access';
import {
  ConfirmationDialogService,
  GalleryButtonsActionComponent,
  NoDataComponent,
} from '@ever-co/shared-components';
import { InfiniteScrollDirective } from '@ever-co/shared-service';
import {
  IActionButton,
  IPhoto,
  IRange,
  ISelected,
} from '@ever-co/shared-utils';
import {
  UploadPhotoItem,
  selectUploadInProgress,
  uploadActions,
} from '@ever-co/upload-data-access';
import { Store } from '@ngrx/store';
import { Observable, Subject, filter, map, take, takeUntil, tap } from 'rxjs';
import { selectSettingStorageState } from '@ever-co/web-setting-data-access';
import { selectDateRange } from '@ever-co/date-picker-data-access';

@Component({
  selector: 'lib-photo-gallery',
  imports: [
    CommonModule,
    InfiniteScrollDirective,
    NoDataComponent,
    MatCardModule,
    MatProgressSpinnerModule,
    PhotoComponent,
    GalleryButtonsActionComponent,
  ],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
})
export class GalleryComponent implements OnInit, OnDestroy {
  public photos$ = new Observable<IPhoto[]>();
  public capturing$ = new Observable<boolean>();
  private destroy$ = new Subject<void>();
  public isAvailable$ = new Observable<boolean>();
  public store = inject(Store);
  private currentPage = 1;
  private hasNext = false;
  private range!: IRange;
  public galleryButtons: IActionButton[] = [];
  public cardButtons: IActionButton[] = [];
  private readonly commonButtons: IActionButton[] = [
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
      loading: this.deleting$,
      action: this.deletePhotos.bind(this),
    },
  ];

  constructor(
    private readonly router: Router,
    private readonly confirmationDialogService: ConfirmationDialogService,
  ) {
    this.cardButtons = [
      {
        icon: 'visibility',
        label: 'View',
        variant: 'default',
        action: this.view.bind(this),
      },
      ...this.commonButtons,
    ];
    this.galleryButtons = [
      {
        icon: 'visibility',
        label: 'View',
        variant: 'default',
        hide: this.moreThanOneSelected$,
        action: this.view.bind(this),
      },
      {
        icon: 'remove_done',
        label: 'Unselect All',
        variant: 'default',
        hide: this.lessThanOneSelected$,
        action: this.unselectAll.bind(this),
      },
      {
        icon: 'remove_done',
        label: 'Unselect',
        variant: 'default',
        hide: this.moreThanOneSelected$,
        action: this.unselectAll.bind(this),
      },
      ...this.commonButtons,
    ];
  }

  ngOnInit(): void {
    this.store
      .select(selectPhotoState)
      .pipe(
        tap((state) => {
          this.hasNext = state.hasNext;
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
    this.isAvailable$ = this.store.select(selectPhotoState).pipe(
      map((state) => state.count > 0),
      takeUntil(this.destroy$),
    );

    this.capturing$ = this.store.select(selectPhotoState).pipe(
      map((state) => state.loading),
      takeUntil(this.destroy$),
    );

    this.photos$ = this.store.select(selectPhotoState).pipe(
      map((state) => state.photos),
      takeUntil(this.destroy$),
    );

    this.store
      .select(selectDateRange)
      .pipe(
        tap((range) => {
          this.range = range;
          this.currentPage = 1;
          this.store.dispatch(photoActions.resetPhotos());
          this.loadPhotos();
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
    this.store
      .select(selectPhotoState)
      .pipe(
        filter(({ deleting }) => deleting),
        tap(() => this.unselectAll()),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  public morePhotos(): void {
    if (this.hasNext) {
      this.currentPage++;
      this.loadPhotos();
    }
  }

  public loadPhotos(): void {
    this.store.dispatch(
      photoActions.loadPhotos({
        page: this.currentPage,
        ...this.range,
      }),
    );
  }

  public selectPhoto(photo: ISelected<IPhoto>): void {
    this.store.dispatch(
      photo.selected
        ? photoActions.selectPhoto({ photo })
        : photoActions.unselectPhoto({ photo }),
    );
  }

  public get selectedPhotos$(): Observable<ISelected<IPhoto>[]> {
    return this.store.select(selectPhotoState).pipe(
      map((state) => state.selectedPhotos),
      takeUntil(this.destroy$),
    );
  }

  public get moreThanOneSelected$(): Observable<boolean> {
    return this.selectedPhotos$.pipe(
      map((photos) => photos.length > 1),
      takeUntil(this.destroy$),
    );
  }

  public get lessThanOneSelected$(): Observable<boolean> {
    return this.selectedPhotos$.pipe(
      map((photos) => photos.length <= 1),
      takeUntil(this.destroy$),
    );
  }

  public get size$(): Observable<number> {
    return this.selectedPhotos$.pipe(
      map((photos) => photos.length),
      takeUntil(this.destroy$),
    );
  }

  private async view(selectedPhotos: ISelected<IPhoto>[]): Promise<void> {
    const photo = selectedPhotos[0].data;
    this.onView(photo);
  }

  private deletePhotos(selectedPhotos: ISelected<IPhoto>[]): void {
    const photos = selectedPhotos.map((photo) => photo.data);
    const size = photos.length;
    const s = size > 1 ? 's' : '';
    this.confirmationDialogService
      .open({
        title: `Delete Photo${s}?`,
        message: `Are you sure you want to delete ${photos.length} photo${s}?`,
        variant: 'danger',
      })
      .pipe(
        take(1),
        filter(Boolean),
        tap(() =>
          this.store.dispatch(photoActions.deleteSelectedPhotos({ photos })),
        ),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  public get deleting$(): Observable<boolean> {
    return this.store.select(selectPhotoState).pipe(
      map((screenshot) => screenshot.deleting),
      takeUntil(this.destroy$),
    );
  }

  public isSelected(photo: IPhoto): Observable<boolean> {
    return this.selectedPhotos$.pipe(
      map((selectedPhotos) =>
        selectedPhotos.some((v) => v.data.id === photo.id),
      ),
      takeUntil(this.destroy$),
    );
  }

  public unselectAll(): void {
    this.store.dispatch(photoActions.unselectAllPhotos());
  }

  public async onView(photo: IPhoto): Promise<void> {
    await this.router.navigate(['/', 'library', 'photos', photo.id]);
    this.store.dispatch(photoActions.unselectAllPhotos());
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

  private upload(selectedPhotos: ISelected<IPhoto>[]): void {
    const size = selectedPhotos.length;
    const s = size > 1 ? 's' : '';

    this.confirmationDialogService
      .open({
        title: `Upload Photo${s}`,
        message: `Are you sure you want to upload photo${s}?`,
        variant: 'primary',
        button: {
          confirm: {
            label: `Upload(${size})`,
            variant: 'success',
            icon: 'backup',
          },
        },
      })
      .pipe(
        take(1),
        filter(Boolean),
        map(() => selectedPhotos.map(({ data }) => new UploadPhotoItem(data))),
        tap((items) =>
          this.store.dispatch(uploadActions.addItemToQueue({ items })),
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
