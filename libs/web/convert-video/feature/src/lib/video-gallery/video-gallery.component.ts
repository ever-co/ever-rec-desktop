import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import {
  selectVideoState,
  videoActions,
} from '@ever-co/convert-video-data-access';
import {
  GalleryButtonsActionComponent,
  NoDataComponent,
  VideoComponent,
} from '@ever-co/shared-components';
import {
  InfiniteScrollDirective,
  UtcToLocalTimePipe,
  selectDatePickerState,
} from '@ever-co/shared-service';
import {
  IActionButton,
  IRange,
  ISelected,
  IVideo,
} from '@ever-co/shared-utils';
import { Store } from '@ngrx/store';
import { Observable, Subject, filter, map, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'lib-video-gallery',
  standalone: true,
  imports: [
    CommonModule,
    InfiniteScrollDirective,
    UtcToLocalTimePipe,
    NoDataComponent,
    MatCardModule,
    MatProgressSpinnerModule,
    RouterLink,
    MatIconModule,
    VideoComponent,
    GalleryButtonsActionComponent,
  ],
  templateUrl: './video-gallery.component.html',
  styleUrl: './video-gallery.component.scss',
})
export class VideoGalleryComponent implements OnInit, OnDestroy {
  public videos$ = new Observable<IVideo[]>();
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

  constructor(private readonly router: Router) {}

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

    this.videos$ = this.store.select(selectVideoState).pipe(
      map((state) => state.videos),
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

  private async view(selectedVideos: ISelected<IVideo>[]): Promise<void> {
    const videoId = selectedVideos[0].data.id;
    await this.router.navigate(['/', 'library', 'videos', videoId]);
    this.store.dispatch(
      videoActions.unselectVideo({ video: selectedVideos[0] })
    );
  }

  private deleteVideos(selectedVideos: ISelected<IVideo>[]): void {
    const videos = selectedVideos.map((video) => video.data);
    this.store.dispatch(videoActions.deleteVideos({ videos }));
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
