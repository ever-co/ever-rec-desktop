import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'lib-toggle',
    imports: [CommonModule],
    templateUrl: './toggle.component.html',
    styleUrl: './toggle.component.scss'
})
export class ToggleComponent {
  @Input() label = 'Enabled';
  @Input() checked = false;
  @Output() check = new EventEmitter<boolean>();

  public onChange() {
    this.checked = !this.checked;
    this.check.emit(this.checked);
  }
}
