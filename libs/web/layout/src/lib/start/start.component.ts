import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  generateVideoActions,
  selectGenerateVideoConfig,
  generateVideoSettingActions,
} from '@ever-co/generate-video-data-access';
import {
  screenshotActions,
  selectScreenshotState,
  selectSettingScreenCaptureState,
  settingScreenCaptureActions,
} from '@ever-co/screenshot-data-access';
import { LayoutService } from '@ever-co/shared-service';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable, take } from 'rxjs';

@Component({
  selector: 'lib-start',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './start.component.html',
  styleUrl: './start.component.scss',
  standalone: true,
})
export class StartComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly layoutService = inject(LayoutService);

  public readonly notCapturing$: Observable<boolean> = this.store
    .select(selectScreenshotState)
    .pipe(map((state) => !state.capturing));

  private readonly screenCaptureConfig$ = this.store
    .select(selectSettingScreenCaptureState)
    .pipe(map(({ screenCaptureConfig }) => screenCaptureConfig));

  private readonly videoConfig$ = this.store
    .select(selectGenerateVideoConfig)
    .pipe(map((config) => config));

  ngOnInit() {
    this.store.dispatch(generateVideoSettingActions.load());
    this.store.dispatch(settingScreenCaptureActions.load());
  }

  public startCapture(): void {
    combineLatest([this.videoConfig$, this.screenCaptureConfig$])
      .pipe(take(1))
      .subscribe(([videoConfig, screenCaptureConfig]) => {
        if (videoConfig.autoGenerate) {
          this.store.dispatch(
            generateVideoActions.autoGenerate({ config: videoConfig }),
          );
        }

        this.store.dispatch(
          screenshotActions.startCapture(screenCaptureConfig),
        );
      });
  }

  public stopCapture(): void {
    this.store.dispatch(screenshotActions.stopCapture());
  }

  public get isTabletView(): boolean {
    return this.layoutService.isTabletView();
  }
}
