import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  ClickHandlerDirective,
  IconFallbackDirective,
  ResizeDirective,
} from '@ever-co/shared-service';
import { IResizeEvent, ITimelineFrame, moment } from '@ever-co/shared-utils';
import {
  selectTimelineState,
  timelineActions,
} from '@ever-co/timeline-data-access';
import { Store } from '@ngrx/store';
import { map, Observable, take } from 'rxjs';
import { TimelinePreviewComponent } from '../timeline-preview/timeline-preview.component';

@Component({
    selector: 'lib-timeline-item',
    imports: [
        CommonModule,
        MatTooltipModule,
        IconFallbackDirective,
        ResizeDirective,
        ClickHandlerDirective,
    ],
    templateUrl: './timeline-item.component.html',
    styleUrl: './timeline-item.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimelineItemComponent {
  @Input() frame!: ITimelineFrame;

  constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog
  ) {}

  public formatTooltipMessage(frame: ITimelineFrame): string {
    return `${frame.metadata?.application?.name || 'frame'} - ${moment(
      frame.createdAt
    ).format('MMM D, YYYY — hh:mm a')}`;
  }

  public get width$(): Observable<number> {
    return this.store.select(selectTimelineState).pipe(
      take(1),
      map((state) => state.track.config.frame.width)
    );
  }

  public showPreview(event: Event) {
    event.stopPropagation();
    this.dialog.open(TimelinePreviewComponent, {
      minWidth: '420px'
    });
  }

  public onResize(event: IResizeEvent) {
    this.store.dispatch(timelineActions.resizeTimelineItem(event));
  }
}
