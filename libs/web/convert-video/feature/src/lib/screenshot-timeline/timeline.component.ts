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
  selectGenerateVideoState,
  selectVideoRemoteControlState,
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
export class TimelineComponent implements OnInit, AfterViewInit, OnDestroy {
  public screenshots$ = new Observable<AggregatedScreenshot[]>();
  public capturing$ = new Observable<boolean>();
  public isAvailable$ = new Observable<boolean>();
  private destroy$ = new Subject<void>();
  @ViewChild('timelineContainer')
  timelineContainer!: ElementRef<HTMLDivElement>;

  constructor(private readonly store: Store) {}
  ngAfterViewInit(): void {
    this.jumpTo({ position: 0 } as AggregatedScreenshot);
  }

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
    const width = timeline.scrollWidth - timeline.clientWidth;
    const percentage = position * 100 + (48 * 100) / width;
    timeline.scrollTo({
      left: width * position + 24 - 5,
      behavior: 'smooth',
    });
    this.store.dispatch(
      videoRemoteControlActions.setScrollPercentage({
        percentage,
      })
    );
  }

  public get percentage$(): Observable<number> {
    return this.store
      .select(selectVideoRemoteControlState)
      .pipe(map((state) => state.scrollPercentage));
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

  public onScroll(event: Event) {
    const element = event.target as HTMLElement;
    const width = element.scrollWidth - element.clientWidth;
    const left = element.scrollLeft;
    const percentage = (left / width) * 100 + ((24 - 5) * 100) / width;
    this.store.dispatch(
      videoRemoteControlActions.setScrollPercentage({ percentage })
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
