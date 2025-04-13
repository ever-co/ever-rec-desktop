import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';

@Component({
  selector: 'lib-control',
  imports: [],
  templateUrl: './control.component.html',
  styleUrl: './control.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlComponent {
  @Output() capture = new EventEmitter<void>();

  public onCapture() {
    this.capture.emit();
  }
}
