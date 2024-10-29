import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  generateVideoActions,
  selectGenerateVideoState,
  selectVideoRemoteControlState,
  videoRemoteControlActions,
} from '@ever-co/convert-video-data-access';
import { selectScreenshotState } from '@ever-co/screenshot-data-access';
import { NoDataComponent } from '@ever-co/shared-components';
import { IScreenshot, moment } from '@ever-co/shared-utils';
import { Store } from '@ngrx/store';
import { map, Observable, Subject, take, takeUntil } from 'rxjs';
import { ProgressComponent } from '../progress/progress.component';
import { VideoComponent } from '../video/video.component';

interface AggregatedScreenshot extends IScreenshot {
  xTimeIcon: number;
  width: number;
  position: number;
}

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
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent implements OnInit, AfterViewInit, OnDestroy {
  public screenshots$!: Observable<AggregatedScreenshot[]>;
  public capturing$!: Observable<boolean>;
  public isAvailable$!: Observable<boolean>;
  public generating$!: Observable<boolean>;
  public percentage$!: Observable<number>;

  @ViewChild('timelineContainer')
  private timelineContainer!: ElementRef<HTMLDivElement>;

  private readonly destroy$ = new Subject<void>();
  private width = 48;
  private clientWidth = 1920;

  constructor(private readonly store: Store) {}

  public ngOnInit(): void {
    this.initializeObservables();
    this.store.dispatch(generateVideoActions.loadLastVideo());
  }

  public ngAfterViewInit(): void {
    this.initializeTimeline();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public jumpTo({ position, width }: AggregatedScreenshot): void {
    const timeline = this.timelineContainer?.nativeElement;
    if (!timeline) return;

    this.width = width;
    this.clientWidth = timeline.clientWidth || 1920;
    const scrollWidth = timeline.scrollWidth - this.clientWidth;

    if (scrollWidth <= 0) {
      const percentage = (position + this.width / 2 / this.clientWidth) * 100;
      this.dispatchScrollPercentage(percentage);
      return;
    }

    const scrollLeft = this.calculateScrollLeft(position, width, scrollWidth);
    const percentage = this.calculatePercentage(scrollLeft, scrollWidth);

    this.scrollTimeline(timeline, scrollLeft, scrollWidth);
    this.dispatchScrollPercentage(percentage);
  }

  public onScroll(event: Event): void {
    const element = event.target as HTMLElement;
    this.clientWidth = element.clientWidth;
    const scrollWidth = element.scrollWidth - this.clientWidth;
    if (scrollWidth <= 0) return;

    const scrollLeft = this.clamp(
      element.scrollLeft,
      0,
      scrollWidth - this.width / 2 - 5
    );

    const percentage = this.calculatePercentage(scrollLeft, scrollWidth);
    this.dispatchScrollPercentage(percentage);
  }

  private calculateScrollLeft(
    position: number,
    width: number,
    scrollWidth: number
  ): number {
    return scrollWidth * position + width / 2 - 5;
  }

  private calculatePercentage(scrollLeft: number, scrollWidth: number): number {
    return (scrollLeft + this.width / 2 - 5) * (100 / scrollWidth);
  }

  private scrollTimeline(
    timeline: HTMLElement,
    scrollLeft: number,
    scrollWidth: number
  ): void {
    timeline.scrollTo({
      left: this.clamp(scrollLeft, 0, scrollWidth - this.width / 2 - 5),
      behavior: 'smooth',
    });
  }

  private initializeObservables(): void {
    this.capturing$ = this.store.select(selectScreenshotState).pipe(
      map((state) => state.capturing || state.loading),
      takeUntil(this.destroy$)
    );

    this.isAvailable$ = this.store.select(selectGenerateVideoState).pipe(
      map(({ video }) => !!video.pathname),
      takeUntil(this.destroy$)
    );

    this.generating$ = this.store.select(selectGenerateVideoState).pipe(
      map((state) => state.generating),
      takeUntil(this.destroy$)
    );

    this.percentage$ = this.store
      .select(selectVideoRemoteControlState)
      .pipe(map((state) => state.scrollPercentage));
  }

  private initializeTimeline(): void {
    this.store
      .select(selectGenerateVideoState)
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe(({ video }) => {
        const screenshots = video?.screenshots || [];
        this.clientWidth =
          this.timelineContainer?.nativeElement?.clientWidth || 1920;
        if (screenshots.length) {
          this.jumpTo({
            position: 0,
            width: this.clamp(this.clientWidth / screenshots.length),
          } as AggregatedScreenshot);
        }
      });

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

  private mergeIcons(screenshots: IScreenshot[]): AggregatedScreenshot[] {
    const size = screenshots.length;
    if (!size) return [];
    return screenshots.map((screenshot, index) => ({
      ...screenshot,
      xTimeIcon: 1,
      position: index / size,
      width: this.clamp(this.clientWidth / size),
    }));
  }

  private clamp(value: number, min = 48, max = 1920): number {
    return Math.max(min, Math.min(max, value));
  }

  private dispatchScrollPercentage(percentage: number): void {
    this.store.dispatch(
      videoRemoteControlActions.setScrollPercentage({ percentage })
    );
  }
}
