import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IconFallbackDirective } from '@ever-co/shared-service';
import { ITimelineFrame, moment } from '@ever-co/shared-utils';
import { selectTimelineState } from '@ever-co/timeline-data-access';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'lib-timeline-item',
  standalone: true,
  imports: [CommonModule, MatTooltipModule, IconFallbackDirective],
  templateUrl: './timeline-item.component.html',
  styleUrl: './timeline-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineItemComponent {
  @Input() frame!: ITimelineFrame;

  constructor(private readonly store: Store) {}

  public formatTooltipMessage(frame: ITimelineFrame): string {
    return `${frame.metadata?.name || 'frame'} - ${moment(
      frame.createdAt
    ).format('MMM D, YYYY — hh:mm a')}`;
  }

  public get width$(): Observable<number> {
    return this.store
      .select(selectTimelineState)
      .pipe(map((state) => state.track.config.frame.width));
  }
}
