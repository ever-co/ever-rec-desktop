import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'lib-control',
  imports: [CommonModule],
  templateUrl: './control.component.html',
  styleUrl: './control.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlComponent {
  @Output() capture = new EventEmitter<void>();
  @Input() saving: boolean | null = false;

  public onCapture(event: Event) {
    event.stopPropagation();
    this.capture.emit();
  }
}
