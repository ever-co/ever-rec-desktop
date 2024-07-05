import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { IScreenshot } from '@prototype/shared/utils';
import { selectScreenshotState } from '@prototype/web/screenshot/data-access';
import { Observable, Subject, map, takeUntil } from 'rxjs';

@Component({
  selector: 'lib-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
})
export class GalleryComponent implements OnInit, OnDestroy {
  public screenshots$ = new Observable<IScreenshot[]>();
  public capturing$ = new Observable<boolean>();
  private destroy$ = new Subject<void>();
  public store = inject(Store);

  ngOnInit(): void {
    this.capturing$ = this.store.select(selectScreenshotState).pipe(
      map((state) => state.capturing || state.loading),
      takeUntil(this.destroy$)
    );

    this.screenshots$ = this.store.select(selectScreenshotState).pipe(
      map((state) => state.screenshots),
      takeUntil(this.destroy$)
    );

    this.store.select(selectScreenshotState).pipe(
      map((state) => console.log(state.screenshots)),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
