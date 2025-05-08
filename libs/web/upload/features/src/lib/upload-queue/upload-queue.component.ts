// upload-queue.component.ts
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  selectCanceled,
  selectCompleted,
  selectFailed,
  selectInProgress,
  selectUploadQueue,
  uploadActions,
  UploadItem,
} from '@ever-co/upload-data-access';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UploadProgressComponent } from '../upload-progress/upload-progress.component';
import { HumanizeBytesPipe } from '@ever-co/shared-service';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { Clipboard } from '@angular/cdk/clipboard';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'lib-upload-queue',
  standalone: true,
  imports: [
    CommonModule,
    UploadProgressComponent,
    HumanizeBytesPipe,
    MatListModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatProgressBarModule,
    MatTabsModule,
    MatSnackBarModule,
    ClipboardModule,
    MatMenuModule,
    MatBadgeModule,
    MatDividerModule,
  ],
  templateUrl: './upload-queue.component.html',
  styleUrl: './upload-queue.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadQueueComponent {
  queue$: Observable<UploadItem[]>;
  inProgress$: Observable<UploadItem[]>;
  completed$: Observable<UploadItem[]>;
  failed$: Observable<UploadItem[]>;
  canceled$: Observable<UploadItem[]>;

  constructor(private store: Store) {
    this.queue$ = this.store.select(selectUploadQueue);
    this.inProgress$ = this.store.select(selectInProgress);
    this.completed$ = this.store.select(selectCompleted);
    this.failed$ = this.store.select(selectFailed);
    this.canceled$ = this.store.select(selectCanceled);
  }

  // Queue management
  cancelUpload(itemId: string): void {
    this.store.dispatch(uploadActions.cancelUpload({ itemId }));
  }

  removeFromQueue(itemId: string): void {
    this.store.dispatch(uploadActions.removeItemFromQueue({ itemId }));
  }

  retryUpload(item: UploadItem): void {
    this.store.dispatch(uploadActions.retryUploadItem({ itemId: item.id }));
  }

  clearCompleted(): void {
    this.store.dispatch(uploadActions.clearUploadOnComplete());
  }

  clearQueue(): void {
    this.store.dispatch(uploadActions.clearUploadQueue());
  }

  clearFailed(): void {
    this.store.dispatch(uploadActions.clearFailedUploads());
  }

  clearCanceled(): void {
    this.store.dispatch(uploadActions.clearCanceledUploads());
  }

  uploadAll(): void {
    this.store.dispatch(uploadActions.uploadAllFromQueue());
  }

  retryAllFailed(): void {
    this.store.dispatch(uploadActions.retryAllFailedUploads());
  }

  cancelAllUploads(): void {
    this.store.dispatch(uploadActions.cancelAllUploads());
  }

  trackByFileId(index: number, file: UploadItem): string {
    return file.id;
  }
}
