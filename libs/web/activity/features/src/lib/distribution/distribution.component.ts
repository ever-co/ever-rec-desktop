import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  activityActions,
  selectActivityState,
} from '@ever-co/activity-data-access';
import { NoDataComponent } from '@ever-co/shared-components';
import { selectDatePickerState } from '@ever-co/shared-service';
import {
  IActivityStateDistribution,
  IdleState,
  IRange,
} from '@ever-co/shared-utils';
import { Store } from '@ngrx/store';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { distinctUntilChanged, map, Observable, Subject, takeUntil, withLatestFrom } from 'rxjs';

interface ChartData {
  name: string;
  value: number;
}

@Component({
  selector: 'lib-distribution',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatIconModule,
    NgxChartsModule,
    NoDataComponent
  ],
  templateUrl: './distribution.component.html',
  styleUrl: './distribution.component.scss',
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate(
          '400ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
    trigger('widthGrow', [
      transition(':enter', [
        style({ width: 0 }),
        animate('600ms ease-out', style({ width: '*' })),
      ]),
    ]),
  ],
  providers: [TitleCasePipe],
})
export class DistributionComponent implements OnDestroy, OnInit {
  private readonly destroy$ = new Subject<void>();
  public lastUpdated: Date = new Date();
  public scheme: Color = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Linear,
    domain: ['#4CAF50', '#FFC107', '#F44336', '#9E9E9E'],
  };

  constructor(
    private readonly store: Store,
    private readonly titleCasePipe: TitleCasePipe
  ) {}
  ngOnInit(): void {
    this.dateRanges$().subscribe((range) => {
      this.store.dispatch(activityActions.loadStateDistribution({ range }));
    });
  }

  public dateRanges$(): Observable<IRange> {
    return this.store.select(selectDatePickerState).pipe(
      map((state) => state.selectedRange),
      takeUntil(this.destroy$)
    );
  }

  private get distribution$(): Observable<IActivityStateDistribution> {
    return this.store.select(selectActivityState).pipe(
      map((state) => state.distribution),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    );
  }

  public get stateEntries$(): Observable<[IdleState, number][]> {
    return this.distribution$.pipe(
      map(
        (distribution) => Object.entries(distribution) as [IdleState, number][]
      ),
      takeUntil(this.destroy$)
    );
  }

  public get chartData$(): Observable<ChartData[]> {
    return this.distribution$.pipe(
      map((distribution) =>
        Object.entries(distribution).map(([state, count]) => ({
          name: this.titleCasePipe.transform(state),
          value: Number(count),
        }))
      ),
      takeUntil(this.destroy$)
    );
  }

  public get active$(): Observable<number> {
    return this.distribution$.pipe(
      withLatestFrom(this.count$),
      map(([distribution, total]) => distribution[IdleState.ACTIVE] / total),
      takeUntil(this.destroy$)
    );
  }

  public get count$(): Observable<number> {
    return this.distribution$.pipe(
      map((distribution) =>
        Object.values(distribution).reduce((sum, count) => sum + count, 0)
      ),
      takeUntil(this.destroy$)
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
