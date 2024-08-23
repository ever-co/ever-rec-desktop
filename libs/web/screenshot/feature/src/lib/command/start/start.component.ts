import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { SCREENSHOT_INTERVAL_DELAY } from '@ever-capture/shared-utils';
import {
    screenshotActions,
    selectScreenshotState,
} from '@ever-capture/web/screenshot/data-access';
import { Store } from '@ngrx/store';
import { Observable, Subject, map, takeUntil } from 'rxjs';

@Component({
  selector: 'lib-start',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './start.component.html',
  styleUrl: './start.component.scss',
})
export class StartComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  public notCapturing$ = new Observable<boolean>();
  private destroy$ = new Subject<void>();

  public ngOnInit(): void {
    this.notCapturing$ = this.store.select(selectScreenshotState).pipe(
      map((state) => !state.capturing),
      takeUntil(this.destroy$)
    );
  }

  public startCapture(): void {
    this.store.dispatch(
      screenshotActions.startCapture({ delay: SCREENSHOT_INTERVAL_DELAY })
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
