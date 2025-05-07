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

  constructor(
    private store: Store,
    private snackBar: MatSnackBar,
    private clipboard: Clipboard
  ) {
    this.queue$ = this.store.select(selectUploadQueue);
    this.inProgress$ = this.store.select(selectInProgress);
    this.completed$ = this.store.select(selectCompleted);
    this.failed$ = this.store.select(selectFailed);
    this.canceled$ = this.store.select(selectCanceled);
  }

  // Queue management
  cancelUpload(itemId: string): void {
    this.store.dispatch(uploadActions.cancelUpload({ itemId }));
    this.snackBar.open('Upload cancelled', 'Close', { duration: 2000 });
  }

  removeFromQueue(itemId: string): void {
    this.store.dispatch(uploadActions.removeItemFromQueue({ itemId }));
    this.snackBar.open('Item removed from queue', 'Close', { duration: 2000 });
  }

  retryUpload(item: UploadItem): void {
    this.store.dispatch(uploadActions.retryUploadItem({ itemId: item.id }));
    this.snackBar.open(`Retrying upload: ${item.name}`, 'Close', {
      duration: 2000,
    });
  }

  clearCompleted(): void {
    this.store.dispatch(uploadActions.clearUploadOnComplete());
    this.snackBar.open('Completed uploads cleared', 'Close', {
      duration: 2000,
    });
  }

  clearQueue(): void {
    //`this.store.dispatch(uploadActions.clearUploadQueue());
    this.snackBar.open('Queue cleared', 'Close', { duration: 2000 });
  }

  clearFailed(): void {
    //this.store.dispatch(uploadActions.clearFailedUploads());
    this.snackBar.open('Failed uploads cleared', 'Close', { duration: 2000 });
  }

  clearCanceled(): void {
    // this.store.dispatch(uploadActions.clearCanceledUploads());
    this.snackBar.open('Canceled uploads cleared', 'Close', { duration: 2000 });
  }

  uploadAll(): void {
    //this.store.dispatch(uploadActions.uploadAllFromQueue());
    this.snackBar.open('Started uploading all queued files', 'Close', {
      duration: 2000,
    });
  }

  retryAllFailed(): void {
    //this.store.dispatch(uploadActions.retryAllFailedUploads());
    this.snackBar.open('Retrying all failed uploads', 'Close', {
      duration: 2000,
    });
  }

  cancelAllUploads(): void {
    //this.store.dispatch(uploadActions.cancelAllUploads());
    this.snackBar.open('All uploads cancelled', 'Close', { duration: 2000 });
  }

  downloadFile(item: UploadItem): void {
    // if (item.url) {
    //   window.open(item.url, '_blank');
    //   this.snackBar.open(`Downloading: ${item.name}`, 'Close', { duration: 2000 });
    // }
  }

  copyFileLink(item: UploadItem): void {
    // if (item.url) {
    //   this.clipboard.copy(item.url);
    //   this.snackBar.open('File link copied to clipboard', 'Close', { duration: 2000 });
    // }
  }

  trackByFileId(index: number, file: UploadItem): string {
    return file.id;
  }

  calculateRemainingTime(item: UploadItem): string {
    // if (!item.uploadSpeed || item.uploadSpeed <= 0 || !item.size || item.progress >= 100) {
    //   return '';
    // }
    //
    // const remainingBytes = item.size * (1 - item.progress / 100);
    // const remainingSeconds = remainingBytes / item.uploadSpeed;
    //
    // if (remainingSeconds < 60) {
    //   return `${Math.ceil(remainingSeconds)}s left`;
    // } else if (remainingSeconds < 3600) {
    //   return `${Math.ceil(remainingSeconds / 60)}m left`;
    // } else {
    //   return `${Math.ceil(remainingSeconds / 3600)}h left`;
    // }
    return '4s left';
  }
}
