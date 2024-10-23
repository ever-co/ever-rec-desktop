import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterLink } from '@angular/router';
import { screenshotActions } from '@ever-co/screenshot-data-access';
import { UtcToLocalTimePipe } from '@ever-co/shared-service';
import { IScreenshot } from '@ever-co/shared-utils';
import { Store } from '@ngrx/store';

@Component({
  selector: 'lib-screenshot',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    RouterLink,
    UtcToLocalTimePipe,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './screenshot.component.html',
  styleUrl: './screenshot.component.scss',
})
export class ScreenshotComponent {
  @Input() screenshot!: IScreenshot;

  constructor(private readonly router: Router, private readonly store: Store) {}

  public async view(): Promise<void> {
    await this.router.navigate([
      '/',
      'library',
      'screenshots',
      this.screenshot.id,
    ]);
  }

  public delete(screenshot: IScreenshot) {
    this.store.dispatch(screenshotActions.deleteScreenshot(screenshot));
  }
}
