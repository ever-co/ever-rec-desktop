import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lib-control',
  imports: [],
  templateUrl: './control.component.html',
  styleUrl: './control.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlComponent {}
