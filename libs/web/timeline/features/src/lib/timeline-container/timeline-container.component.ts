import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'lib-timeline-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline-container.component.html',
  styleUrl: './timeline-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineContainerComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
