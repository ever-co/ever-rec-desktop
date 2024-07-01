import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { SCREENSHOT_INTERVAL_DELAY } from '@prototype/shared/utils';
import { screenshotActions } from '@prototype/web/screenshot/data-access';

@Component({
  selector: 'lib-start',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './start.component.html',
  styleUrl: './start.component.scss',
})
export class StartComponent {
  private readonly store = inject(Store);

  public startCapture() {
    this.store.dispatch(
      screenshotActions.startCapture({ delay: SCREENSHOT_INTERVAL_DELAY })
    );
  }
}
