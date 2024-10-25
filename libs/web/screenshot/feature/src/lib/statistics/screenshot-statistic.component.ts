import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import {
  screenshotActions,
  selectScreenshotState,
} from '@ever-co/screenshot-data-access';
import {
  NoDataComponent,
  selectDatePickerState,
} from '@ever-co/shared-components';
import { InfiniteScrollDirective } from '@ever-co/shared-service';
import { IRange, IScreenshotMetadataStatistic } from '@ever-co/shared-utils';
import { Store } from '@ngrx/store';
import { map, Observable, Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'lib-screenshot-statistic',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressBarModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    NoDataComponent,
    InfiniteScrollDirective,
  ],
  templateUrl: './screenshot-statistic.component.html',
  styleUrl: './screenshot-statistic.component.scss',
})
export class ScreenshotStatisticComponent implements OnInit {
  private destroy$ = new Subject<void>();
  public statistics$!: Observable<IScreenshotMetadataStatistic[]>;
  private currentPage = 1;
  private hasNext = false;
  private range!: IRange;

  constructor(private readonly store: Store) {}
  ngOnInit(): void {
    this.store
      .select(selectScreenshotState)
      .pipe(
        tap((state) => {
          this.hasNext = state.statistic.hasNext;
        })
      )
      .subscribe();
    this.statistics$ = this.store
      .select(selectScreenshotState)
      .pipe(map((state) => state.statistic.currents));

    this.store
      .select(selectDatePickerState)
      .pipe(
        tap((state) => {
          this.range = state.selectedRange;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  public calculateProgress(count: number, total: number): number {
    return total > 0 ? (count / total) * 100 : 0;
  }

  public getColor(percentage: number) {
    if (percentage < 50) {
      return 'warn';
    } else if (percentage < 75) {
      return 'accent';
    } else {
      return 'primary';
    }
  }

  public moreStats() {
    if (this.hasNext) {
      this.currentPage++;
      this.loadStats();
    }
  }

  public loadStats(): void {
    this.store.dispatch(
      screenshotActions.getScreenshotsStatistics({
        page: this.currentPage,
        ...this.range,
      })
    );
  }
}
