import { Injectable, inject } from '@angular/core';
import { generateVideoActions } from '@ever-co/generate-video-data-access';
import { NotificationService } from '@ever-co/notification-data-access';
import { IUpload } from '@ever-co/shared-utils';
import { selectSettingUploadAutoSync } from '@ever-co/web-setting-data-access';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { EMPTY, of, forkJoin } from 'rxjs';
import {
  catchError,
  filter,
  map,
  mergeMap,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { UploadVideoItem } from '../models/upload-video.model';
import { UploadMapper } from '../models/upload.model';
import { UploadService } from '../services/upload.service';
import { uploadActions } from './upload.actions';
import { selectCanUploadMore, selectInProgress, selectUploadInProgress, selectUploadQueue } from './upload.selectors';

@Injectable()
export class UploadEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);

  processQueue$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        uploadActions.addItemToQueue,
        uploadActions.uploadItemSuccess,
        uploadActions.uploadItemFailure,
        uploadActions.retryAllFailedUploads,
        uploadActions.uploadAllFromQueue,
        uploadActions.startItemUploadSuccess,
      ),
      withLatestFrom(
        this.store.select(selectCanUploadMore),
        this.store.select(selectSettingUploadAutoSync),
        this.store.select(selectUploadQueue),
      ),
      mergeMap(([_, canUploadMore, canUpload, queue]) => {
        // Early return if conditions aren't met
        if (!canUploadMore || !canUpload || queue.length === 0) {
          return EMPTY;
        }

        const nextItem = queue[0];
        return of(uploadActions.startItemUpload({ item: nextItem }));
      }),
      // Filter out any undefined/empty actions if needed
      filter((action) => !!action),
    ),
  );

  uploadOnFinish$ = createEffect(() =>
    this.actions$.pipe(
      ofType(generateVideoActions.finish),
      filter(({ video }) => video.synced === false),
      map(({ video }) =>
        uploadActions.addItemToQueue({
          item: new UploadVideoItem(video),
        }),
      ),
    ),
  );

  upload$ = createEffect(() =>
    this.actions$.pipe(
      ofType(uploadActions.startItemUpload),
      // Extract and process videos in a single operation
      mergeMap(({ item }) => {
        if (!item) {
          return of(uploadActions.silentUploadCancellation());
        }

        const config: IUpload = UploadMapper.toUpload(item);

        return this.uploadService.upload(config).pipe(
          map(() => uploadActions.startItemUploadSuccess({ config })),
          catchError((_) => {
            this.notificationService.show('Upload failed', 'error');
            return of(uploadActions.removeItemFromQueue({ itemId: item.id }));
          }),
        );
      }),
    ),
  );

  onError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(uploadActions.startItemUploadSuccess),
      switchMap(() =>
        this.uploadService.onError().pipe(
          tap(({ error }) => this.notificationService.show(error, 'error')),
          map(({ itemId, error }) =>
            uploadActions.uploadItemFailure({ error, itemId }),
          ),
        ),
      ),
    ),
  );

  onProgress$ = createEffect(() =>
    this.actions$.pipe(
      ofType(uploadActions.startItemUploadSuccess),
      switchMap(() =>
        this.uploadService
          .onProgress()
          .pipe(
            map((progress) => uploadActions.uploadItemInProgress(progress)),
          ),
      ),
    ),
  );

  onDone$ = createEffect(() =>
    this.actions$.pipe(
      ofType(uploadActions.startItemUploadSuccess),
      switchMap(() =>
        this.uploadService.onDone().pipe(
          tap(() =>
            this.notificationService.show('Upload successfully', 'success'),
          ),
          map(({ itemId }) => uploadActions.uploadItemSuccess({ itemId })),
        ),
      ),
    ),
  );

  onCancel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(uploadActions.cancelUpload),
      switchMap(({ itemId }) =>
        this.uploadService.cancel(itemId).pipe(
          tap(() =>
            this.notificationService.show('Upload Canceled.', 'warning'),
          ),
          map(() => uploadActions.cancelUploadSuccess()),
        ),
      ),
    ),
  );

  onSilentCancellation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(uploadActions.silentUploadCancellation),
      map(() => uploadActions.cancelUploadSuccess()),
    ),
  );

  cancelAllUploads$ = createEffect(() =>
    this.actions$.pipe(
      ofType(uploadActions.cancelAllUploads),
      withLatestFrom(this.store.select(selectInProgress)),
      mergeMap(([_, inProgress]) => {
        if (!inProgress.length) {
          this.notificationService.show('No uploads to cancel.', 'info');
          return of(uploadActions.cancelAllUploadsSuccess());
        }
        // Cancel all in-progress uploads using forkJoin
        return forkJoin(inProgress.map((item) => this.uploadService.cancel(item.id))).pipe(
          tap(() => this.notificationService.show('All uploads canceled.', 'warning')),
          map(() => uploadActions.cancelAllUploadsSuccess()),
          catchError(() => {
            this.notificationService.show('Error canceling uploads.', 'error');
            return of(uploadActions.cancelAllUploadsSuccess());
          })
        );
      }),
      mergeMap((action) => of(action)),
    ),
  );

  constructor(
    private readonly uploadService: UploadService,
    private readonly notificationService: NotificationService,
  ) { }
}
