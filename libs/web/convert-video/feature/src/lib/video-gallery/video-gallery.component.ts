import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import {
  generateVideoActions,
  selectGenerateVideoState,
} from '@ever-co/convert-video-data-access';
import { NoDataComponent, VideoComponent } from '@ever-co/shared-components';
import {
  InfiniteScrollDirective,
  UtcToLocalTimePipe,
} from '@ever-co/shared-service';
import { IVideo } from '@ever-co/shared-utils';
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

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    this.store
      .select(selectGenerateVideoState)
      .pipe(
        tap((state) => {
          this.hasNext = state.hasNext;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
    this.isAvailable$ = this.store.select(selectGenerateVideoState).pipe(
      map((state) => state.count > 0),
      takeUntil(this.destroy$)
    );

    this.videos$ = this.store.select(selectGenerateVideoState).pipe(
      map((state) => {
        console.log(state);
        return state.videos;
      }),
      takeUntil(this.destroy$)
    );

    this.loadVideos();
  }

  public moreVideos(): void {
    if (this.hasNext) {
      this.currentPage++;
      this.loadVideos();
    }
  }

  public loadVideos(): void {
    this.store.dispatch(
      generateVideoActions.loadVideos({ page: this.currentPage })
    );
  }

  public async onView(video: IVideo): Promise<void> {
    await this.router.navigate(['/', 'library', 'videos', video.id]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
