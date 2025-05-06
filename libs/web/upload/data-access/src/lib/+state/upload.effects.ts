import { Injectable, inject } from '@angular/core';
import { generateVideoActions } from '@ever-co/convert-video-data-access';
import { NotificationService } from '@ever-co/notification-data-access';
import { IUpload, UploadType } from '@ever-co/shared-utils';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { UploadService } from '../services/upload.service';
import { uploadActions } from './upload.actions';

@Injectable()
export class UploadEffects {
  private readonly actions$ = inject(Actions);

  uploadOnFinish$ = createEffect(() =>
    this.actions$.pipe(
      ofType(generateVideoActions.finish),
      map((action) => uploadActions.uploadVideos({ videos: [action.video] }))
    )
  );

  uploadVideo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(uploadActions.uploadVideos),
      // Extract and process videos in a single operation
      mergeMap(({ videos }) => {
        const validIds = videos
          .filter(({ isTimeline }) => !isTimeline)
          .map(({ id }) => id);

        if (validIds.length === 0) {
          return of(uploadActions.silentUploadCancellation());
        }

        const config: IUpload = {
          type: UploadType.VIDEO,
          key: 'file',
          ids: validIds,
        };

        return this.uploadService.upload(config).pipe(
          map(() => uploadActions.inProgress({ config })),
          catchError((error: Error) => {
            this.notificationService.show('Upload failed', 'error');
            return of(
              uploadActions.uploadVideosFailure({
                error: error.message || 'Unknown upload error',
              })
            );
          })
        );
      })
    )
  );

  uploadPhoto$ = createEffect(() =>
    this.actions$.pipe(
      ofType(uploadActions.uploadPhotos),
      // Extract and validate photo IDs
      map(({ photos }) => photos.filter(Boolean).map(({ id }) => id)),
      // Continue only if we have valid IDs
      switchMap((validIds) => {
        if (validIds.length === 0) {
          return of(uploadActions.silentUploadCancellation());
        }

        const config: IUpload = {
          type: UploadType.PHOTO,
          key: 'file',
          ids: validIds,
        };

        return this.uploadService.upload(config).pipe(
          // Dispatch in-progress action on success
          map(() => uploadActions.inProgress({ config })),
          // Handle errors gracefully
          catchError((error) => {
            this.notificationService.show('Upload failed', 'error');
            return of(uploadActions.uploadPhotosFailure({ error }));
          })
        );
      })
    )
  );

  onError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(uploadActions.uploadVideos, generateVideoActions.finish),
      switchMap(() =>
        this.uploadService.onError().pipe(
          tap((error) => this.notificationService.show(error, 'error')),
          map((error) => uploadActions.uploadVideosFailure({ error })),
          catchError((error) =>
            of(uploadActions.uploadVideosFailure({ error }))
          )
        )
      )
    )
  );

  onProgress$ = createEffect(() =>
    this.actions$.pipe(
      ofType(uploadActions.inProgress),
      switchMap(() =>
        this.uploadService.onProgress().pipe(
          map((progress) => uploadActions.onProgress({ progress })),
          catchError((error) =>
            of(uploadActions.uploadVideosFailure({ error }))
          )
        )
      )
    )
  );

  onDone$ = createEffect(() =>
    this.actions$.pipe(
      ofType(uploadActions.inProgress),
      switchMap(() =>
        this.uploadService.onDone().pipe(
          tap(() =>
            this.notificationService.show('Upload successfully', 'success')
          ),
          map(() => uploadActions.uploadVideosSuccess()),
          catchError((error) =>
            of(uploadActions.uploadVideosFailure({ error }))
          )
        )
      )
    )
  );

  onCancel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(uploadActions.cancelUpload),
      switchMap(() =>
        this.uploadService.cancel().pipe(
          tap(() =>
            this.notificationService.show('Upload Canceled.', 'warning')
          ),
          map(() => uploadActions.cancelUploadSuccess()),
          catchError((error) =>
            of(uploadActions.uploadVideosFailure({ error }))
          )
        )
      )
    )
  );

  onSilentCancellation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(uploadActions.silentUploadCancellation),
      map(() => uploadActions.cancelUploadSuccess()),
      catchError((error) => of(uploadActions.uploadVideosFailure({ error })))
    )
  );

  public upload(config: IUpload) {
    return this.uploadService.upload(config).pipe(
      // Dispatch in-progress action on success
      map(() => uploadActions.inProgress({ config })),
      // Handle errors gracefully
      catchError((error) => {
        this.notificationService.show('Upload failed', 'error');
        return of(uploadActions.uploadVideosFailure({ error }));
      })
    );
  }

  constructor(
    private readonly uploadService: UploadService,
    private readonly notificationService: NotificationService
  ) {}
}
