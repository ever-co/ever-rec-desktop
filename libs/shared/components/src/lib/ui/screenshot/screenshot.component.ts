import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { screenshotActions } from '@ever-co/screenshot-data-access';
import {
  IconFallbackDirective,
  ImgFallbackDirective,
  PopoverDirective,
  UtcToLocalTimePipe,
} from '@ever-co/shared-service';
import { IActionButton, IScreenshot, ISelected } from '@ever-co/shared-utils';
import { Store } from '@ngrx/store';
import { ActionButtonGroupComponent } from '../action-button-group/group/action-button-group.component';

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
    ActionButtonGroupComponent,
    ImgFallbackDirective,
    IconFallbackDirective,
    MatCheckboxModule,
  ],
  templateUrl: './screenshot.component.html',
  styleUrl: './screenshot.component.scss',
})
export class ScreenshotComponent {
  @Input() screenshot!: IScreenshot;

  @Input()
  public checked: boolean | null = false;

  @Output()
  public selected = new EventEmitter<ISelected<IScreenshot>>();

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

  public onSelected(checked: boolean): void {
    this.checked = checked;
    this.selected.emit({
      data: this.screenshot,
      selected: checked,
    });
  }

  public delete(screenshot: IScreenshot) {
    this.store.dispatch(screenshotActions.deleteScreenshot(screenshot));
  }
}
