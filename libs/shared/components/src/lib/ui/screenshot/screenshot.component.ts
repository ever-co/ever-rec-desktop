import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { screenshotActions } from '@ever-co/screenshot-data-access';
import { PopoverDirective, UtcToLocalTimePipe } from '@ever-co/shared-service';
import { IActionButton, IScreenshot } from '@ever-co/shared-utils';
import { Store } from '@ngrx/store';
import { ActionButtonGroupComponent } from "../action-button-group/group/action-button-group.component";

@Component({
  selector: 'lib-screenshot',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    RouterLink,
    UtcToLocalTimePipe,
    PopoverDirective,
    MatIconModule,
    MatButtonModule,
    ActionButtonGroupComponent
],
  templateUrl: './screenshot.component.html',
  styleUrl: './screenshot.component.scss',
})
export class ScreenshotComponent {
  @Input() screenshot!: IScreenshot;
  public actionButtons: IActionButton[] = [
    {
      icon: 'visibility',
      label: 'View',
      variant: 'default',
      action: this.view.bind(this),
    },
    {
      icon: 'delete',
      label: 'Delete',
      variant: 'danger',
      action: this.delete.bind(this),
    },
  ];

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
