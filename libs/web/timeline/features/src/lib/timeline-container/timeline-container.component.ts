import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { generateVideoActions } from '@ever-co/convert-video-data-access';
import { Store } from '@ngrx/store';
import { TimelineCursorComponent } from '../timeline-cursor/timeline-cursor.component';
import { TimelineTrackComponent } from '../timeline-track/timeline-track.component';
import { TimelineVideoComponent } from '../timeline-video/timeline-video.component';

@Component({
  selector: 'lib-timeline-container',
  standalone: true,
  imports: [
    CommonModule,
    TimelineTrackComponent,
    TimelineVideoComponent,
    TimelineCursorComponent,
  ],
  templateUrl: './timeline-container.component.html',
  styleUrl: './timeline-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineContainerComponent implements OnInit {
  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(generateVideoActions.loadLastVideo());
  }
}
