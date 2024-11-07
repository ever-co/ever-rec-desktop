import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Clipboard } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NotificationService } from '@ever-co/notification-data-access';
import { CopyContextService } from './copy-context.service';

@Component({
  selector: 'lib-copy-context',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './copy-context-button.component.html',
  styleUrl: './copy-context-button.component.scss',
  animations: [
    trigger('iconState', [
      state(
        'copy',
        style({
          transform: 'scale(1)',
          color: 'rgba(0, 0, 0, 0.87)',
        })
      ),
      state(
        'checked',
        style({
          transform: 'scale(1)',
        })
      ),
      transition('copy => checked', [
        animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)'),
      ]),
      transition('checked => copy', [
        animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)'),
      ]),
    ]),
    trigger('iconRotate', [
      state(
        'copy',
        style({
          transform: 'rotate(0deg)',
        })
      ),
      state(
        'checked',
        style({
          transform: 'rotate(360deg)',
        })
      ),
      transition('copy => checked', [
        animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)'),
      ]),
      transition('checked => copy', [
        animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)'),
      ]),
    ]),
    trigger('scaleButton', [
      state(
        'normal',
        style({
          transform: 'scale(1)',
        })
      ),
      state(
        'pressed',
        style({
          transform: 'scale(0.9)',
        })
      ),
      transition('normal => pressed', [
        animate('100ms cubic-bezier(0.4, 0.0, 0.2, 1)'),
      ]),
      transition('pressed => normal', [
        animate('100ms cubic-bezier(0.4, 0.0, 0.2, 1)'),
      ]),
    ]),
  ],
})
export class CopyContextButtonComponent {
  public copying = false;
  public pressing = false;
  constructor(
    private readonly copyContextService: CopyContextService,
    private readonly notificationService: NotificationService,
    private readonly clipboard: Clipboard
  ) {}

  public async copyContext(): Promise<void> {
    try {
      this.copying = true;
      const context = await this.copyContextService.context();
      this.clipboard.copy(context);
      this.notificationService.show('Copied context to clipboard', 'success');
    } catch (error) {
      this.notificationService.show('Failed to copy context', 'error');
    } finally {
      setTimeout(() => {
        this.copying = false;
      }, 3000);
    }
  }
}
