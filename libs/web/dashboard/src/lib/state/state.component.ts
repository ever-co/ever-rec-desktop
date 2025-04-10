import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { selectGenerateVideoState } from '@ever-co/convert-video-data-access';
import { selectScreenshotState } from '@ever-co/screenshot-data-access';
import { Store } from '@ngrx/store';
import { map, Observable, Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'lib-state',
    imports: [
        CommonModule,
        MatCardModule,
        MatIconModule,
        MatProgressSpinnerModule,
    ],
    templateUrl: './state.component.html',
    styleUrl: './state.component.scss'
})
export class StateComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(private readonly store: Store) {}

  public get capturing$(): Observable<boolean> {
    return this.store.select(selectScreenshotState).pipe(
      map((state) => state.capturing),
      takeUntil(this.destroy$)
    );
  }
  public get generating$(): Observable<boolean> {
    return this.store.select(selectGenerateVideoState).pipe(
      map((state) => state.generating),
      takeUntil(this.destroy$)
    );
  }

  public get progress$(): Observable<number> {
    return this.store.select(selectGenerateVideoState).pipe(
      map((state) => state.progress || 0),
      takeUntil(this.destroy$)
    );
  }

  public get formattedProgress$(): Observable<number> {
    return this.progress$.pipe(
      map((progress) => progress / 100),
      takeUntil(this.destroy$)
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
