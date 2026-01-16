import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';


@Component({
  selector: 'lib-progress-bar',
  standalone: true,
  imports: [],
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressComponent {
  @Input() progress = 0;
  @Input() showThumb = false;
  @Input() isActive = false;
  @Output() seek = new EventEmitter<number>();

  public handleClick(event: MouseEvent): void {
    const progressBar = event.currentTarget as HTMLElement;
    const rect = progressBar.getBoundingClientRect();
    const clickPositionRatio = (event.clientX - rect.left) / rect.width;
    this.seek.emit(clickPositionRatio);
  }
}
