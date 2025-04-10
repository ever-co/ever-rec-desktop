import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { IActionButton } from '@ever-co/shared-utils';
import { combineLatest, filter, map, Observable, of } from 'rxjs';
import { ActionButtonComponent } from '../button/action-button.component';

@Component({
    selector: 'lib-action-button-group',
    imports: [CommonModule, ActionButtonComponent],
    templateUrl: './action-button-group.component.html',
    styleUrl: './action-button-group.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionButtonGroupComponent {
  private _buttons: IActionButton[] = [];

  @Input() data: any;
  public get buttons(): IActionButton[] {
    return this._buttons.map((button) =>
      button.hide ? button : { ...button, hide: of(false) }
    );
  }

  @Input()
  public set buttons(value: IActionButton[]) {
    this._buttons = value;
  }
  @Output() actionTriggered = new EventEmitter<IActionButton>();

  public onActionTriggered(button: IActionButton): void {
    this.actionTriggered.emit(button);
  }
  public get isShow$(): Observable<boolean> {
    const observables = this.buttons.map((button) => {
      if (!button.hide) {
        return of(false);
      }
      return button.hide.pipe(map((value) => value));
    });

    return combineLatest(observables).pipe(
      filter(Boolean),
      map((values) => values.some((v) => !v))
    );
  }
}
