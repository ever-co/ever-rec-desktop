import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    selectGenerateVideoState,
    videoRemoteControlActions,
} from '@ever-co/convert-video-data-access';
import { selectScreenshotState } from '@ever-co/screenshot-data-access';
import { IScreenshot } from '@ever-co/shared-utils';
import { Store } from '@ngrx/store';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { VideoComponent } from '../video/video.component';

type AggregatedScreenshot = IScreenshot & { xTimeIcon: number; width: number };

@Component({
  selector: 'lib-timeline',
  standalone: true,
  imports: [CommonModule, VideoComponent],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss',
})
export class TimelineComponent implements OnInit, OnDestroy {
  public screenshots$ = new Observable<AggregatedScreenshot[]>();
  public capturing$ = new Observable<boolean>();
  private destroy$ = new Subject<void>();
  public store = inject(Store);
  public scrollPercentage = 0;

  ngOnInit(): void {
    this.capturing$ = this.store.select(selectScreenshotState).pipe(
      map((state) => state.capturing || state.loading),
      takeUntil(this.destroy$)
    );
    this.screenshots$ = this.store.select(selectGenerateVideoState).pipe(
      map(({ video }) => {
        const screenshots = video?.screenshots || [];
        return this.mergeIcons(screenshots);
      }),
      takeUntil(this.destroy$)
    );
  }

  private mergeIcons(screenshots: IScreenshot[]): AggregatedScreenshot[] {
    const size = screenshots.length;
    if (!size) return [];

    const result: AggregatedScreenshot[] = [];
    let current: AggregatedScreenshot = {
      ...screenshots[0],
      xTimeIcon: 1,
      width: this.clamp(1920 / size),
    };

    for (let i = 1; i < size; i++) {
      const screenshot = screenshots[i];
      if (current.metadata?.name === screenshot.metadata?.name) {
        current.xTimeIcon++;
      } else {
        result.push(current);
        current = {
          ...screenshot,
          xTimeIcon: 1,
          width: this.clamp(1920 / size),
        };
      }
    }
    result.push(current);

    return result;
  }

  private clamp(value: number, min = 64, max = 1920): number {
    return Math.max(min, Math.min(max, value));
  }

  public onScroll(event: any) {
    const element = event.target;
    const scrollHeight = element.scrollWidth - element.clientWidth;
    const scrollTop = element.scrollLeft;
    const percentage = (scrollTop / scrollHeight) * 100;
    this.scrollPercentage = percentage;
    this.store.dispatch(
      videoRemoteControlActions.setScrollPercentage({ percentage })
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
