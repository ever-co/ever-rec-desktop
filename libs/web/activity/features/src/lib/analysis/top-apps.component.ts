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
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <mat-card class="w-full" appearance="outlined">
      <mat-card-content class="p-2 sm:p-4">
        <div class="flex items-center mb-3 sm:mb-4 gap-2">
          <mat-icon class="text-gray-500 text-xl sm:text-2xl">apps</mat-icon>
          <div class="text-base sm:text-lg font-semibold text-gray-700">Top Applications</div>
        </div>
        <div class="flex flex-wrap gap-3 sm:gap-4 md:gap-6 justify-center sm:justify-start">
          @for (app of topApps$ | async; track app.name; let idx = $index) {
            <div class="group cursor-pointer flex flex-col items-center">
              <!-- Stacked icons container with responsive sizing -->
              <div class="relative h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 mb-1 sm:mb-2 bounce-on-hover">
                <!-- Background shadow layers for stack effect -->
                <div class="absolute inset-0 bg-gray-300 rounded-lg transform translate-x-1 translate-y-1 sm:translate-x-2 sm:translate-y-2 opacity-20"></div>
                <div class="absolute inset-0 bg-gray-400 rounded-lg transform translate-x-0.5 translate-y-0.5 sm:translate-x-1 sm:translate-y-1 opacity-30"></div>
                <!-- Main app icon -->
                <div class="relative z-10 w-full h-full rounded-lg shadow-md sm:shadow-lg border border-gray-200 bg-white overflow-hidden transition-transform">
                  <img [src]="app.icon"
                       alt="{{app.name}} icon"
                       class="w-full h-full object-contain p-0.5 sm:p-1" />
                </div>
              </div>
              <!-- App name with responsive text -->
              <div class="text-center">
                <div class="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-gray-900 max-w-[60px] sm:max-w-[80px] md:max-w-[100px] truncate px-1">
                  {{ app.name }}
                </div>
              </div>
            </div>
          } @empty {
            <div class="text-gray-400 text-center py-4 sm:py-6 text-sm sm:text-base w-full">No application data available</div>
          }
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    :host {
      display: block;
    }

    @keyframes bounce {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-12px);
      }
    }

    @keyframes bounce-sm {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-16px);
      }
    }

    @keyframes bounce-md {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-20px);
      }
    }

    @keyframes subtle-bounce {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-6px);
      }
    }

    @keyframes subtle-bounce-sm {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-8px);
      }
    }

    .bounce-on-hover {
      transition: all 0.3s ease;
    }

    /* Mobile bounce */
    @media (max-width: 639px) {
      .bounce-on-hover:hover {
        animation: bounce 0.6s ease-in-out;
      }

      .flex-wrap > div:first-child .bounce-on-hover {
        animation: subtle-bounce 2s ease-in-out infinite;
      }
    }

    /* Tablet and desktop bounce */
    @media (min-width: 640px) {
      .bounce-on-hover:hover {
        animation: bounce-sm 0.6s ease-in-out;
      }

      .flex-wrap > div:first-child .bounce-on-hover {
        animation: subtle-bounce-sm 2s ease-in-out infinite;
      }
    }

    @media (min-width: 768px) {
      .bounce-on-hover:hover {
        animation: bounce-md 0.6s ease-in-out;
      }
    }

    /* Stop the continuous animation on hover to trigger the bounce */
    .flex-wrap > div:first-child .bounce-on-hover:hover {
      animation-name: bounce, bounce-sm, bounce-md;
      animation-duration: 0.6s;
      animation-timing-function: ease-in-out;
    }
  `]
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
