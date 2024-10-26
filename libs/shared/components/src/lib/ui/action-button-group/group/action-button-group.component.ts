import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IActionButton } from '@ever-co/shared-utils';
import { ActionButtonComponent } from '../button/action-button.component';

@Component({
  selector: 'lib-action-button-group',
  standalone: true,
  imports: [CommonModule, ActionButtonComponent],
  templateUrl: './action-button-group.component.html',
  styleUrl: './action-button-group.component.scss',
})
export class ActionButtonGroupComponent {
  @Input() data: any;
  @Input() buttons: IActionButton[] = [];
  @Output() actionTriggered = new EventEmitter<IActionButton>();

  public onActionTriggered(button: IActionButton): void {
    this.actionTriggered.emit(button);
  }
}
