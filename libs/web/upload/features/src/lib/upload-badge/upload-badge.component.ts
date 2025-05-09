import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UploadQueueComponent } from '../upload-queue/upload-queue.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { selectActiveUploads } from '@ever-co/upload-data-access';
import { CommonModule } from '@angular/common';
import { PopoverDirective } from '@ever-co/shared-service';

@Component({
  selector: 'lib-upload-badge',
  imports: [
    CommonModule,
    PopoverDirective,
    UploadQueueComponent,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './upload-badge.component.html',
  styleUrl: './upload-badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadBadgeComponent {
  constructor(private readonly store: Store) {}

  public get active$() {
    return this.store.select(selectActiveUploads);
  }
}
