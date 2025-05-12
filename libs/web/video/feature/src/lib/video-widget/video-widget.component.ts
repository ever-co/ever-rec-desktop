import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { selectVideoState } from '@ever-co/video-data-access';
import { NumberSuffixPipe } from '@ever-co/shared-service';
import { Store } from '@ngrx/store';
import { map, Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'lib-video-widget',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    RouterLink,
    MatTooltipModule,
    NumberSuffixPipe,
  ],
  templateUrl: './video-widget.component.html',
  styleUrl: './video-widget.component.scss',
})
export class VideoWidgetComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(private readonly store: Store) {}

  public get videoCount$(): Observable<number> {
    return this.store.select(selectVideoState).pipe(
      map((state) => state.count),
      takeUntil(this.destroy$),
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
