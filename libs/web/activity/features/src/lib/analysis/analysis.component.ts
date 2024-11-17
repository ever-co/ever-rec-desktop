import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  activityActions,
  selectActivityState,
} from '@ever-co/activity-data-access';
import { HumanizePipe, selectDatePickerState } from '@ever-co/shared-service';
import { IRange, IWorkPatternAnalysis } from '@ever-co/shared-utils';
import { Store } from '@ngrx/store';
import { map, Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'lib-analysis',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatButtonModule,
    MatChipsModule,
    MatSlideToggleModule,
    HumanizePipe,
    MatTooltipModule
  ],
  templateUrl: './analysis.component.html',
  styleUrl: './analysis.component.scss',
  animations: [
    trigger('fadeSlideInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(
          '500ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
    trigger('progressBar', [
      state('void', style({ width: '0%' })),
      state('*', style({ width: '{{ percentage }}%' }), {
        params: { percentage: 0 },
      }),
      transition('void => *', animate('1000ms ease-out')),
    ]),
    trigger('tagAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
    ]),
  ],
})
export class AnalysisComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.dateRanges$().subscribe((range) => {
      this.store.dispatch(activityActions.loadWorkPatternAnalysis({ range }));
    });
  }

  public get analysis$(): Observable<IWorkPatternAnalysis> {
    return this.store.select(selectActivityState).pipe(
      map((state) => state.analysis),
      takeUntil(this.destroy$)
    );
  }

  public dateRanges$(): Observable<IRange> {
    return this.store.select(selectDatePickerState).pipe(
      map((state) => state.selectedRange),
      takeUntil(this.destroy$)
    );
  }

  public getConsistencyColor(score: number): string {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  }

  public getConsistencyLabel(score: number): string {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
