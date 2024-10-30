import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import {
  selectVideoState,
  videoActions,
} from '@ever-co/convert-video-data-access';
import { ActionButtonGroupComponent, NoDataComponent, VideoComponent } from '@ever-co/shared-components';
import {
  InfiniteScrollDirective,
  UtcToLocalTimePipe,
  selectDatePickerState,
} from '@ever-co/shared-service';
import { IActionButton, IRange, ISelected, IVideo } from '@ever-co/shared-utils';
import { Store } from '@ngrx/store';
import { Observable, Subject, map, takeUntil, tap } from 'rxjs';

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
    ActionButtonGroupComponent
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
  public selectedVideos: ISelected<IVideo>[] = [];
  public actionButtons: IActionButton[] = [
    {
      icon: 'videocam',
      label: 'Merge',
      variant: 'warning',
    },
      {
        icon: 'delete',
        label: 'Delete',
        variant: 'danger',
      },
  ]

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
    this.selectedVideos = [
      ...new Map(
        [...this.selectedVideos, video].map((item) => [item.data.id, item])
      ).values(),
    ].filter((item) => item.selected);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
