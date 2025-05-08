import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import {
  generateVideoActions,
  selectGenerateVideoState,
  selectSettingState,
  selectVideoState,
  videoActions,
} from '@ever-co/convert-video-data-access';
import {
  ConfirmationDialogService,
  GalleryButtonsActionComponent,
  NoDataComponent,
  VideoComponent,
} from '@ever-co/shared-components';
import {
  InfiniteScrollDirective,
  selectDatePickerState,
} from '@ever-co/shared-service';
import {
  IActionButton,
  IRange,
  ISelected,
  IVideo,
} from '@ever-co/shared-utils';
import {
  UploadVideoItem,
  selectUploadInProgress,
  uploadActions,
} from '@ever-co/upload-data-access';
import { selectSettingStorageState } from '@ever-co/web-setting-data-access';
import { Store } from '@ngrx/store';
import {
  Observable,
  Subject,
  combineLatest,
  filter,
  map,
  take,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs';

@Component({
  selector: 'lib-video-gallery',
  imports: [
    CommonModule,
    InfiniteScrollDirective,
    NoDataComponent,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    VideoComponent,
    GalleryButtonsActionComponent,
  ],
  templateUrl: './video-gallery.component.html',
  styleUrl: './video-gallery.component.scss',
})
export class VideoGalleryComponent implements OnInit, OnDestroy {
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
      icon: 'merge',
      label: 'Merge',
      variant: 'warning',
      hide: this.lessThanOneSelected$,
      action: this.mergeVideos.bind(this),
      loading: this.generating$,
    },
    {
      icon: 'backup',
      label: 'Upload',
      variant: 'success',
      action: this.upload.bind(this),
      loading: this.uploading$,
      hide: this.isHidden$,
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
      action: this.deleteVideos.bind(this),
    },
  ];

  constructor(
    private readonly router: Router,
    private readonly confirmationDialogService: ConfirmationDialogService
  ) {}

  ngOnInit(): void {
    this.store
      .select(selectVideoState)
      .pipe(
        tap((state) => {
          this.hasNext = state.hasNext;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();

    this.isAvailable$ = this.store.select(selectVideoState).pipe(
      map((state) => state.count > 0),
      takeUntil(this.destroy$)
    );

    this.store
      .select(selectDatePickerState)
      .pipe(
        tap((state) => {
          this.range = state.selectedRange;
          this.currentPage = 1;
          this.store.dispatch(videoActions.resetVideos());
          this.loadVideos();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();

    this.store
      .select(selectVideoState)
      .pipe(
        filter(({ deleting }) => deleting),
        tap(() => this.unselectAll()),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  public get isHidden$(): Observable<boolean> {
    return combineLatest([this.isUploadHidden$, this.selectedVideos$]).pipe(
      map(
        ([isUploadHidden, videos]) =>
          isUploadHidden || !!videos[0]?.data?.isTimeline
      )
    );
  }

  public get videos$(): Observable<IVideo[]> {
    return this.store.select(selectVideoState).pipe(
      map((state) => state.videos),
      takeUntil(this.destroy$)
    );
  }

  private get generating$(): Observable<boolean> {
    return this.store.select(selectGenerateVideoState).pipe(
      map((state) => state.generating),
      takeUntil(this.destroy$)
    );
  }

  private async view(selectedVideos: ISelected<IVideo>[]): Promise<void> {
    const videoId = selectedVideos[0].data.id;
    await this.router.navigate(['/', 'library', 'videos', videoId]);
    this.store.dispatch(
      videoActions.unselectVideo({ video: selectedVideos[0] })
    );
  }

  private deleteVideos(selectedVideos: ISelected<IVideo>[]): void {
    const videos = selectedVideos.map((video) => video.data);
    this.confirmationDialogService
      .open({
        title: 'Delete Videos',
        message: `Are you sure you want to delete these ${videos.length} videos?`,
        variant: 'danger',
      })
      .pipe(
        take(1),
        filter(Boolean),
        tap(() => this.store.dispatch(videoActions.deleteVideos({ videos }))),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  public moreVideos(): void {
    if (this.hasNext) {
      this.currentPage++;
      this.loadVideos();
    }
  }

  public loadVideos(): void {
    this.store.dispatch(
      videoActions.loadVideos({ page: this.currentPage, ...this.range })
    );
  }

  public selectVideo(video: ISelected<IVideo>): void {
    this.store.dispatch(
      video.selected
        ? videoActions.selectVideo({ video })
        : videoActions.unselectVideo({ video })
    );
  }

  public get selectedVideos$(): Observable<ISelected<IVideo>[]> {
    return this.store.select(selectVideoState).pipe(
      map((state) => state.selectedVideos),
      takeUntil(this.destroy$)
    );
  }

  public get moreThanOneSelected$(): Observable<boolean> {
    return this.selectedVideos$.pipe(
      map((videos) => videos.length > 1),
      takeUntil(this.destroy$)
    );
  }

  public get lessThanOneSelected$(): Observable<boolean> {
    return this.selectedVideos$.pipe(
      map((videos) => videos.length <= 1),
      takeUntil(this.destroy$)
    );
  }

  public get size$(): Observable<number> {
    return this.selectedVideos$.pipe(
      map((videos) => videos.length),
      takeUntil(this.destroy$)
    );
  }

  public get uploading$(): Observable<boolean> {
    return this.store
      .select(selectUploadInProgress)
      .pipe(takeUntil(this.destroy$));
  }

  public get deleting$(): Observable<boolean> {
    return this.store.select(selectVideoState).pipe(
      map((video) => video.deleting),
      takeUntil(this.destroy$)
    );
  }

  public isSelected(video: IVideo): Observable<boolean> {
    return this.selectedVideos$.pipe(
      map((selectedVideos) =>
        selectedVideos.some((v) => v.data.id === video.id)
      ),
      takeUntil(this.destroy$)
    );
  }

  public unselectAll(): void {
    this.store.dispatch(videoActions.unselectAllVideos());
  }

  private get isUploadHidden$(): Observable<boolean> {
    return this.store.select(selectSettingStorageState).pipe(
      map(({ uploadConfig }) => !uploadConfig.manualSync),
      takeUntil(this.destroy$)
    );
  }

  private upload(selectedVideos: ISelected<IVideo>[]): void {
    this.confirmationDialogService
      .open({
        title: 'Upload Videos',
        message: `Are you sure you want to upload selected videos?`,
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
        tap(() => {
          const items = selectedVideos
            .filter(({ data }) => !data.isTimeline)
            .map(({ data }) => new UploadVideoItem(data));
          this.store.dispatch(uploadActions.addItemToQueue({ items }));
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private mergeVideos(selectedVideos: ISelected<IVideo>[]): void {
    const videoIds = selectedVideos.map((video) => video.data.id);
    this.confirmationDialogService
      .open({
        title: 'Merge Videos',
        message: 'Are you sure you want to merge these videos?',
        variant: 'warning',
        button: {
          confirm: {
            label: 'Merge',
            variant: 'warning',
            icon: 'merge',
          },
        },
      })
      .pipe(
        take(1),
        filter(Boolean),
        withLatestFrom(this.store.select(selectSettingState)),
        tap(([, { videoConfig: config }]) =>
          this.store.dispatch(generateVideoActions.start({ videoIds, config }))
        ),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
