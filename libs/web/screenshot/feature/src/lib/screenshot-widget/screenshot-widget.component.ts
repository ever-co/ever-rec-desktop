import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { selectScreenshotState } from '@ever-co/screenshot-data-access';
import { NumberSuffixPipe } from '@ever-co/shared-service';
import { Store } from '@ngrx/store';
import { map, Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'lib-screenshot-widget',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    RouterLink,
    MatTooltipModule,
    NumberSuffixPipe,
  ],
  templateUrl: './screenshot-widget.component.html',
  styleUrl: './screenshot-widget.component.scss',
})
export class ScreenshotWidgetComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(private readonly store: Store) {}

  public get screenshotCount$(): Observable<number> {
    return this.store.select(selectScreenshotState).pipe(
      map((state) => state.count),
      takeUntil(this.destroy$)
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
