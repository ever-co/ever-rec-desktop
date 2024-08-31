import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  screenshotActions,
  selectScreenshotState,
} from '@ever-capture/screenshot-data-access';
import {
  InfiniteScrollDirective,
  UtcToLocalTimePipe,
} from '@ever-capture/shared-service';
import { IScreenshot } from '@ever-capture/shared-utils';
import { Store } from '@ngrx/store';
import { Observable, Subject, map, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'lib-gallery',
  standalone: true,
  imports: [CommonModule, InfiniteScrollDirective, UtcToLocalTimePipe],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
})
export class GalleryComponent implements OnInit, OnDestroy {
  public screenshots$ = new Observable<IScreenshot[]>();
  public capturing$ = new Observable<boolean>();
  private destroy$ = new Subject<void>();
  public store = inject(Store);
  private currentPage = 1;
  private hasNext = false;

  ngOnInit(): void {
    this.store
      .select(selectScreenshotState)
      .pipe(
        tap((state) => {
          this.hasNext = state.hasNext;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();

    this.capturing$ = this.store.select(selectScreenshotState).pipe(
      map((state) => state.capturing || state.loading),
      takeUntil(this.destroy$)
    );

    this.screenshots$ = this.store.select(selectScreenshotState).pipe(
      map((state) => state.screenshots),
      takeUntil(this.destroy$)
    );

    this.loadScreenshots();
  }

  public moreScreenshots(): void {
    if (this.hasNext) {
      this.currentPage++;
      this.loadScreenshots();
    }
  }

  public loadScreenshots(): void {
    this.store.dispatch(
      screenshotActions.loadScreenshots({ page: this.currentPage })
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
