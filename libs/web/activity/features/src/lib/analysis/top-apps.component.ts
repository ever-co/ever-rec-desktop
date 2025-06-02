import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { IRange, ITopApplicationProductivity } from '@ever-co/shared-utils';
import { HumanizePipe } from '@ever-co/shared-service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { activityActions, selectTopApplicationsProductivity } from '@ever-co/activity-data-access';
import { Store } from '@ngrx/store';
import { selectDateRange } from '@ever-co/date-picker-data-access';

@Component({
  selector: 'lib-top-apps',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, HumanizePipe],
  template: `
    <mat-card class="w-full" appearance="outlined">
      <mat-card-content class="p-4">
        <div class="flex items-center mb-4 gap-2">
          <mat-icon class="text-gray-500">apps</mat-icon>
          <div class="text-lg font-semibold text-gray-700">Top Applications</div>
        </div>
        <div *ngIf="(topApps$ | async)?.length; else noApps">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div *ngFor="let app of topApps$ | async" class="flex items-center gap-4 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
              <img [src]="app.icon" alt="{{app.name}} icon" class="w-10 h-10 rounded shadow border border-gray-200 object-contain" />
              <div class="flex-1">
                <div class="font-medium text-gray-800">{{ app.name }}</div>
                <div class="text-xs text-gray-500">{{ app.totalDuration | humanize: 'seconds' : 'hh:mm:ss' }}</div>
              </div>
              <div class="flex flex-col items-end">
                <span class="font-semibold text-indigo-600">{{ app.productivityPercent | percent:'1.2-2' }}</span>
                <span class="text-xs text-gray-400">Productivity</span>
              </div>
            </div>
          </div>
        </div>
        <ng-template #noApps>
          <div class="text-gray-400 text-center py-6">No application data available</div>
        </ng-template>
      </mat-card-content>
    </mat-card>
  `
})
export class TopAppsComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  public readonly topApps$: Observable<ITopApplicationProductivity[]>;

  constructor(private readonly store: Store) {
    this.topApps$ = this.store.select(selectTopApplicationsProductivity);
  }

  ngOnInit(): void {
    this.dateRanges$().subscribe((range) => {
      this.store.dispatch(activityActions.loadTopApplicationsProductivity({ range, limit: 5 }));
    });
  }

  public dateRanges$(): Observable<IRange> {
    return this.store.select(selectDateRange).pipe(takeUntil(this.destroy$));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
