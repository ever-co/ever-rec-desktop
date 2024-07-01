import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { screenshotActions } from '@prototype/web/screenshot/data-access';

@Component({
  selector: 'lib-stop',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stop.component.html',
  styleUrl: './stop.component.scss',
})
export class StopComponent {
  private readonly store = inject(Store);

  public stopCapture() {
    this.store.dispatch(screenshotActions.stopCapture());
  }
}
