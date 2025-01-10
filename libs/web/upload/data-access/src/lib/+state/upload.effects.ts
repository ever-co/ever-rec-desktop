import { Injectable, inject } from '@angular/core';
import { generateVideoActions } from '@ever-co/convert-video-data-access';
import { NotificationService } from '@ever-co/notification-data-access';
import { IUpload, UploadType } from '@ever-co/shared-utils';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { iif, of } from 'rxjs';
import {
  catchError,
  map,
  mergeMap,
  switchMap,
  tap,
} from 'rxjs/operators';
import { VideoUploadService } from '../services/video-upload.service';
import { uploadActions } from './upload.actions';

@Injectable()
export class UploadEffects {
  private readonly actions$ = inject(Actions);

  upload$ = createEffect(() =>
    this.actions$.pipe(
      // Listen for specific actions
      ofType(generateVideoActions.finish, uploadActions.uploadVideo),

      // Normalize action payloads to extract videos
      map((action) =>
        action.type === generateVideoActions.finish.type
          ? [action.video]
          : action.videos
      ),

      // Extract valid IDs for videos not in the timeline
      map((videos) => ({
        ids: videos.filter(({ isTimeline }) => !isTimeline).map(({ id }) => id),
      })),

      // Interrupt upload if no IDs are found
      switchMap((valids) =>
        iif(
          () => valids.ids.length > 0,
          of(valids), // Proceed with upload
          of(uploadActions.silentUploadCancellation()) // Dispatch cancellation action
        )
      ),

      // Handle upload logic
      mergeMap((result) => {
        if (!('ids' in result)) {
          // Handle early cancellation
          return of(result);
        }

        const { ids } = result;
        const config: IUpload = {
          type: UploadType.VIDEO,
          key: 'file',
          ids,
        };

        return this.videoUploadService.upload(config).pipe(
          // Dispatch in-progress action on success
          map(() => uploadActions.inProgress({ config })),

          // Handle errors gracefully
          catchError((error) => {
            this.notificationService.show('Upload failed', 'error');
            return of(uploadActions.uploadVideoFailure({ error }));
          })
        );
      })
    )
  );

  onError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(uploadActions.uploadVideo, generateVideoActions.finish),
      switchMap(() =>
        this.videoUploadService.onError().pipe(
          tap((error) => this.notificationService.show(error, 'error')),
          map((error) => uploadActions.uploadVideoFailure({ error })),
          catchError((error) => of(uploadActions.uploadVideoFailure({ error })))
        )
      )
    )
  );

  onProgress$ = createEffect(() =>
    this.actions$.pipe(
      ofType(uploadActions.inProgress),
      switchMap(() =>
        this.videoUploadService.onProgress().pipe(
          map((progress) => uploadActions.onProgress({ progress })),
          catchError((error) => of(uploadActions.uploadVideoFailure({ error })))
        )
      )
    )
  );

  onDone$ = createEffect(() =>
    this.actions$.pipe(
      ofType(uploadActions.inProgress),
      switchMap(() =>
        this.videoUploadService.onDone().pipe(
          tap(() =>
            this.notificationService.show('Upload successfully', 'success')
          ),
          map(() => uploadActions.uploadVideoSuccess()),
          catchError((error) => of(uploadActions.uploadVideoFailure({ error })))
        )
      )
    )
  );

  onCancel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(uploadActions.cancelUpload),
      switchMap(() =>
        this.videoUploadService.cancel().pipe(
          tap(() =>
            this.notificationService.show('Upload Canceled.', 'warning')
          ),
          map(() => uploadActions.cancelUploadSuccess()),
          catchError((error) => of(uploadActions.uploadVideoFailure({ error })))
        )
      )
    )
  );

  onSilentCancellation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(uploadActions.silentUploadCancellation),
      map(() => uploadActions.cancelUploadSuccess()),
      catchError((error) => of(uploadActions.uploadVideoFailure({ error })))
    )
  );

  constructor(
    private readonly videoUploadService: VideoUploadService,
    private readonly notificationService: NotificationService
  ) {}
}
