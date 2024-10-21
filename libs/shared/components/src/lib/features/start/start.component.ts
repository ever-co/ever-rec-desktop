import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  screenshotActions,
  selectScreenshotState,
  selectSettingScreenCaptureState,
} from '@ever-co/screenshot-data-access';
import { IScreenCaptureConfig } from '@ever-co/shared-utils';
import { Store } from '@ngrx/store';
import { Observable, Subject, map, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'lib-start',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './start.component.html',
  styleUrl: './start.component.scss',
})
export class StartComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  public notCapturing$ = new Observable<boolean>();
  private destroy$ = new Subject<void>();
  private config!: IScreenCaptureConfig;

  public ngOnInit(): void {
    this.notCapturing$ = this.store.select(selectScreenshotState).pipe(
      map((state) => !state.capturing),
      takeUntil(this.destroy$)
    );
    this.store
      .select(selectSettingScreenCaptureState)
      .pipe(
        tap(({ screenCaptureConfig }) => (this.config = screenCaptureConfig)),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  public startCapture(): void {
    this.store.dispatch(screenshotActions.startCapture(this.config));
  }

  public stopCapture() {
    this.store.dispatch(screenshotActions.stopCapture());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
