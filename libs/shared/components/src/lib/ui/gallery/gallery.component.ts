import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  screenshotActions,
  selectScreenshotState,
} from '@ever-co/screenshot-data-access';
import {
  InfiniteScrollDirective,
  UtcToLocalTimePipe,
} from '@ever-co/shared-service';
import { IScreenshot } from '@ever-co/shared-utils';
import { Store } from '@ngrx/store';
import { Observable, Subject, map, takeUntil, tap } from 'rxjs';
import { NoDataComponent } from '../no-data/no-data.component';

@Component({
    selector: 'lib-gallery',
    imports: [CommonModule, InfiniteScrollDirective, UtcToLocalTimePipe, NoDataComponent],
    templateUrl: './gallery.component.html',
    styleUrl: './gallery.component.scss'
})
export class GalleryComponent implements OnInit, OnDestroy {
  public screenshots$ = new Observable<IScreenshot[]>();
  public capturing$ = new Observable<boolean>();
  private destroy$ = new Subject<void>();
  public isAvailable$ =new Observable<boolean>();
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
      this.isAvailable$ = this.store.select(selectScreenshotState).pipe(
        map((state) => state.count > 0),
        takeUntil(this.destroy$)
      );

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
