import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  selectGenerateVideoState,
  videoRemoteControlActions,
} from '@ever-co/convert-video-data-access';
import { selectScreenshotState } from '@ever-co/screenshot-data-access';
import { NoDataComponent } from '@ever-co/shared-components';
import { IScreenshot, moment } from '@ever-co/shared-utils';
import { Store } from '@ngrx/store';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { ProgressComponent } from '../progress/progress.component';
import { VideoComponent } from '../video/video.component';

type AggregatedScreenshot = IScreenshot & {
  xTimeIcon: number;
  width: number;
  position: number;
};

@Component({
  selector: 'lib-timeline',
  standalone: true,
  imports: [
    CommonModule,
    VideoComponent,
    NoDataComponent,
    MatTooltipModule,
    ProgressComponent,
  ],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss',
})
export class TimelineComponent implements OnInit, OnDestroy {
  public screenshots$ = new Observable<AggregatedScreenshot[]>();
  public capturing$ = new Observable<boolean>();
  public isAvailable$ = new Observable<boolean>();
  public scrollPercentage = 0;
  private destroy$ = new Subject<void>();
  @ViewChild('timelineContainer')
  timelineContainer!: ElementRef<HTMLDivElement>;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.capturing$ = this.store.select(selectScreenshotState).pipe(
      map((state) => state.capturing || state.loading),
      takeUntil(this.destroy$)
    );
    this.isAvailable$ = this.store.select(selectGenerateVideoState).pipe(
      map(({ video }) => !!video.pathname),
      takeUntil(this.destroy$)
    );
    this.screenshots$ = this.store.select(selectGenerateVideoState).pipe(
      map(({ video }) => {
        const screenshots = [...(video?.screenshots || [])].sort((a, b) =>
          moment(a.createdAt).diff(moment(b.createdAt))
        );
        return this.mergeIcons(screenshots);
      }),
      takeUntil(this.destroy$)
    );
  }

  public jumpTo({ position }: AggregatedScreenshot): void {
    const timeline = this.timelineContainer?.nativeElement;
    if (!timeline) return;
    const percentage = position * 100;
    const width = timeline.scrollWidth - timeline.clientWidth;
    timeline.scrollTo({
      left: width * position,
      behavior: 'smooth',
    });
    this.store.dispatch(
      videoRemoteControlActions.setScrollPercentage({
        percentage,
      })
    );
  }

  private mergeIcons(screenshots: IScreenshot[]): AggregatedScreenshot[] {
    const size = screenshots.length;
    if (!size) return [];
    return screenshots.map((screenshot, index) => ({
      ...screenshot,
      xTimeIcon: 1,
      position: index / size,
      width: this.clamp(1920 / size),
    }));
  }

  public get generating$(): Observable<boolean> {
    return this.store.select(selectGenerateVideoState).pipe(
      map((state) => state.generating),
      takeUntil(this.destroy$)
    );
  }

  private clamp(value: number, min = 48, max = 1920): number {
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
