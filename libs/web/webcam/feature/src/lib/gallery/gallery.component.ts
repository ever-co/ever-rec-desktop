import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';

import {
  ConfirmationDialogService,
  GalleryButtonsActionComponent,
  NoDataComponent,
  PhotoComponent,
} from '@ever-co/shared-components';
import {
  InfiniteScrollDirective,
  selectDatePickerState,
} from '@ever-co/shared-service';
import {
  IActionButton,
  IPhoto,
  IRange,
  ISelected,
} from '@ever-co/shared-utils';
import { photoActions, selectPhotoState } from '@ever-co/webcam-data-access';
import { Store } from '@ngrx/store';
import { Observable, Subject, filter, map, take, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'lib-screenshot-gallery',
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
  public actionButtons: IActionButton[] = [
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
    private readonly confirmationDialogService: ConfirmationDialogService
  ) {}

  ngOnInit(): void {
    this.store
      .select(selectPhotoState)
      .pipe(
        tap((state) => {
          this.hasNext = state.hasNext;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
    this.isAvailable$ = this.store.select(selectPhotoState).pipe(
      map((state) => state.count > 0),
      takeUntil(this.destroy$)
    );

    this.capturing$ = this.store.select(selectPhotoState).pipe(
      map((state) => state.loading),
      takeUntil(this.destroy$)
    );

    this.photos$ = this.store.select(selectPhotoState).pipe(
      map((state) => state.photos),
      takeUntil(this.destroy$)
    );

    this.store
      .select(selectDatePickerState)
      .pipe(
        tap((state) => {
          this.range = state.selectedRange;
          this.currentPage = 1;
          this.store.dispatch(photoActions.resetPhotos());
          this.loadPhotos();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
    this.store
      .select(selectPhotoState)
      .pipe(
        filter(({ deleting }) => deleting),
        tap(() => this.unselectAll()),
        takeUntil(this.destroy$)
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
      })
    );
  }

  public selectPhoto(photo: ISelected<IPhoto>): void {
    this.store.dispatch(
      photo.selected
        ? photoActions.selectPhoto({ photo })
        : photoActions.unselectPhoto({ photo })
    );
  }

  public get selectedPhotos$(): Observable<ISelected<IPhoto>[]> {
    return this.store.select(selectPhotoState).pipe(
      map((state) => state.selectedPhotos),
      takeUntil(this.destroy$)
    );
  }

  public get moreThanOneSelected$(): Observable<boolean> {
    return this.selectedPhotos$.pipe(
      map((photos) => photos.length > 1),
      takeUntil(this.destroy$)
    );
  }

  public get lessThanOneSelected$(): Observable<boolean> {
    return this.selectedPhotos$.pipe(
      map((photos) => photos.length <= 1),
      takeUntil(this.destroy$)
    );
  }

  public get size$(): Observable<number> {
    return this.selectedPhotos$.pipe(
      map((photos) => photos.length),
      takeUntil(this.destroy$)
    );
  }

  private async view(selectedPhotos: ISelected<IPhoto>[]): Promise<void> {
    const photoId = selectedPhotos[0].data.id;
    await this.router.navigate(['/', 'library', 'photos', photoId]);
    this.store.dispatch(
      photoActions.unselectPhoto({
        photo: selectedPhotos[0],
      })
    );
  }

  private deletePhotos(selectedPhotos: ISelected<IPhoto>[]): void {
    const photos = selectedPhotos.map((photo) => photo.data);
    this.confirmationDialogService
      .open({
        title: 'Delete Photos?',
        message: `Are you sure you want to delete ${photos.length} photos?`,
        variant: 'danger',
      })
      .pipe(
        take(1),
        filter(Boolean),
        tap(() =>
          this.store.dispatch(photoActions.deleteSelectedPhotos({ photos }))
        ),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  public get deleting$(): Observable<boolean> {
    return this.store.select(selectPhotoState).pipe(
      map((screenshot) => screenshot.deleting),
      takeUntil(this.destroy$)
    );
  }

  public isSelected(photo: IPhoto): Observable<boolean> {
    return this.selectedPhotos$.pipe(
      map((selectedPhotos) =>
        selectedPhotos.some((v) => v.data.id === photo.id)
      ),
      takeUntil(this.destroy$)
    );
  }

  public unselectAll(): void {
    this.store.dispatch(photoActions.unselectAllPhotos());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
