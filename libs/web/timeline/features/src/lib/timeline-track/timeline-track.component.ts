import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  InfiniteScrollDirective,
  ResizeDirective,
} from '@ever-co/shared-service';
import {
  IResizeEvent,
  ITimelineFrame,
  ITimelineState,
  ITimelineTrack,
  IVideo,
} from '@ever-co/shared-utils';
import {
  selectTimelineState,
  timelineActions,
} from '@ever-co/timeline-data-access';
import { Store } from '@ngrx/store';
import {
  distinctUntilChanged,
  filter,
  map,
  Observable,
  Subject,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { TimelineItemComponent } from '../timeline-item/timeline-item.component';

@Component({
  selector: 'lib-timeline-track',
  standalone: true,
  imports: [
    CommonModule,
    TimelineItemComponent,
    ResizeDirective,
    InfiniteScrollDirective,
  ],
  templateUrl: './timeline-track.component.html',
  styleUrl: './timeline-track.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineTrackComponent implements OnInit, AfterViewInit {
  @ViewChild('trackContainer')
  private trackContainer!: ElementRef<HTMLDivElement>;
  private destroy$ = new Subject<void>();

  videoId!: string;
  frame: ITimelineFrame | null = null;
  page = 1;
  hasNext = false;
  limit = 20;

  constructor(private readonly store: Store) {}

  ngAfterViewInit(): void {
    this.timeline$
      .pipe(
        filter(({ player }) => player.isPlaying),
        tap(({ cursor, track }) => {
          const width = track.config.frame.width * track.count;
          this.track.scroll({
            left: width * (cursor.position / 100),
            behavior: 'smooth',
          });
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }
  ngOnInit(): void {
    this.source$
      .pipe(
        filter(Boolean),
        distinctUntilChanged(),
        tap((videoId) => (this.videoId = videoId)),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.loadFrames());
    this.track$
      .pipe(
        tap((state) => {
          this.hasNext = state.hasNext;
          this.page = state.page;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  public get frames$(): Observable<ITimelineFrame[]> {
    return this.track$.pipe(map(({ frames }) => frames));
  }

  private get track$(): Observable<ITimelineTrack> {
    return this.store.select(selectTimelineState).pipe(
      map(({ track }) => track),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    );
  }

  private get timeline$(): Observable<ITimelineState> {
    return this.store
      .select(selectTimelineState)
      .pipe(distinctUntilChanged(), takeUntil(this.destroy$));
  }

  private get source$(): Observable<string> {
    return this.store.select(selectTimelineState).pipe(
      map(({ player }) => player.video.id),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    );
  }

  public onSelect(selectedFrame: ITimelineFrame): void {
    const selectedFrameIsCurrentFrame = selectedFrame === this.frame;
    const frame = selectedFrameIsCurrentFrame ? null : selectedFrame;

    this.frame = frame;
    this.timeline$
      .pipe(
        take(1),
        tap(({ track: { config, count, frames } }) => {
          if (!this.frame) return;
          const width = config.frame.width * count;
          const scrollWidth = width - this.track.clientWidth;
          const position =
            frames.findIndex((frame) => frame.id === this.frame?.id) / count;
          this.track.scroll({
            left: scrollWidth * position,
            behavior: 'smooth',
          });
          this.store.dispatch(
            timelineActions.selectFrame({ frame: this.frame })
          );
          if (scrollWidth < 1) {
            this.store.dispatch(
              timelineActions.cursorPosition({
                position: Math.max(0, Math.min(100, position * 100)),
              })
            );
          }
        })
      )
      .subscribe();
  }

  public onTrackResize(event: IResizeEvent): void {
    this.store.dispatch(timelineActions.resizeTimeline(event));
  }

  public get track(): HTMLDivElement {
    return this.trackContainer?.nativeElement;
  }

  public moreFrames() {
    if (this.hasNext) {
      this.page++;
      this.loadFrames();
    }
  }

  public onScroll(event: Event) {
    this.timeline$
      .pipe(
        take(1),
        tap(({ track: { config, count } }) => {
          const element = event.target as HTMLElement;
          const scrollLeft = element.scrollLeft;
          const width = config.frame.width * count;
          const scrollWidth = width - this.track.clientWidth;

          const position = (scrollLeft * 100) / scrollWidth;

          this.store.dispatch(
            timelineActions.cursorPosition({
              position: Math.max(0, Math.min(100, position)),
            })
          );
        })
      )
      .subscribe();
  }

  public loadFrames(): void {
    if (!this.videoId) return;
    this.store.dispatch(
      timelineActions.loadFrames({
        page: this.page,
        limit: this.limit,
        sortField: 'createdAt',
        sortOrder: 'ASC',
        deleted: true,
        where: {
          video: {
            id: this.videoId,
          } as IVideo,
        },
      })
    );
  }
}
