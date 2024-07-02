import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { SCREENSHOT_INTERVAL_DELAY } from '@prototype/shared/utils';
import {
  screenshotActions,
  selectScreenshotState,
} from '@prototype/web/screenshot/data-access';
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
