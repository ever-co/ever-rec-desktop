import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IScreenshot } from '@prototype/shared/utils';
import {
  selectGenerateVideoState,
  videoRemoteControlActions,
} from '@prototype/web/convert-video/data-access';
import { selectScreenshotState } from '@prototype/web/screenshot/data-access';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { VideoComponent } from '../video/video.component';

type AggregatedScreenshot = IScreenshot & { xTimeIcon: number };

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

  private mergeIcons(
    screenshots: IScreenshot[]
  ): (IScreenshot & { xTimeIcon: number })[] {
    if (!screenshots.length) return [];

    const result: (IScreenshot & { xTimeIcon: number })[] = [];
    let current: IScreenshot & { xTimeIcon: number } = {
      ...screenshots[0],
      xTimeIcon: 1,
    };

    for (let i = 1; i < screenshots.length; i++) {
      const screenshot = screenshots[i];
      if (current.metadata?.name === screenshot.metadata?.name) {
        current.xTimeIcon++;
      } else {
        result.push(current);
        current = { ...screenshot, xTimeIcon: 1 };
      }
    }
    result.push(current);

    return result;
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
