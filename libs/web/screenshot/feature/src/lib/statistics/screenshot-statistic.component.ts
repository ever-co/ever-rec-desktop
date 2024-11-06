import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import {
  screenshotActions,
  selectScreenshotState,
} from '@ever-co/screenshot-data-access';
import { NoDataComponent } from '@ever-co/shared-components';
import {
  IconFallbackDirective,
  InfiniteScrollDirective,
  selectDatePickerState,
} from '@ever-co/shared-service';
import { IRange, IScreenshotMetadataStatistic } from '@ever-co/shared-utils';
import { Store } from '@ngrx/store';
import { map, Observable, Subject, takeUntil, tap } from 'rxjs';
import { ScreenshotStatisticsChartComponent } from '../chart/screenshot-statistics-chart.component';

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
    IconFallbackDirective,
    ScreenshotStatisticsChartComponent,
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

  constructor(private readonly store: Store, private router: Router) {}
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
          this.currentPage = 1;
          this.store.dispatch(screenshotActions.resetScreenshotsStatistics());
          this.loadStats();
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

  public onSearch(statistic: IScreenshotMetadataStatistic) {
    this.store.dispatch(screenshotActions.resetAsk());
    this.store.dispatch(
      screenshotActions.ask({ filter: statistic.name, page: 1 })
    );
    this.store.dispatch(
      screenshotActions.addToHistory({ searchQuery: statistic.name })
    );
    this.router.navigate(['/', 'search']);
  }
}
