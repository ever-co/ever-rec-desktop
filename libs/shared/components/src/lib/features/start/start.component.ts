import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  generateVideoActions,
  selectSettingState,
  settingActions,
} from '@ever-co/convert-video-data-access';
import {
  screenshotActions,
  selectScreenshotState,
  selectSettingScreenCaptureState,
  settingScreenCaptureActions,
} from '@ever-co/screenshot-data-access';
import { LayoutService } from '@ever-co/shared-service';
import { IScreenCaptureConfig, IVideoConfig } from '@ever-co/shared-utils';
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
  private screenCaptureConfig!: IScreenCaptureConfig;
  private videoConfig!: IVideoConfig;

  constructor( private readonly layoutService: LayoutService){}

  public ngOnInit(): void {
    this.notCapturing$ = this.store.select(selectScreenshotState).pipe(
      map((state) => !state.capturing),
      takeUntil(this.destroy$)
    );
    this.store
      .select(selectSettingScreenCaptureState)
      .pipe(
        tap(
          ({ screenCaptureConfig }) =>
            (this.screenCaptureConfig = screenCaptureConfig)
        ),
        takeUntil(this.destroy$)
      )
      .subscribe();

    this.store
      .select(selectSettingState)
      .pipe(
        tap(({ videoConfig }) => (this.videoConfig = videoConfig)),
        takeUntil(this.destroy$)
      )
      .subscribe();

    this.store.dispatch(settingActions.load());
    this.store.dispatch(settingScreenCaptureActions.load());
  }

  public startCapture(): void {
    if (this.videoConfig.autoGenerate) {
      this.store.dispatch(
        generateVideoActions.autoGenerate({ config: this.videoConfig })
      );
    }

    this.store.dispatch(
      screenshotActions.startCapture(this.screenCaptureConfig)
    );
  }

  public stopCapture() {
    this.store.dispatch(screenshotActions.stopCapture());
  }

  public get isTabletView() {
    return this.layoutService.isTabletView();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
