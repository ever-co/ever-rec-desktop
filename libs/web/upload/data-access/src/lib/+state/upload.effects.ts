import { Injectable } from '@angular/core';
import { generateVideoActions } from '@ever-co/convert-video-data-access';
import { NotificationService } from '@ever-co/notification-data-access';
import { IUpload, UploadType } from '@ever-co/shared-utils';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { VideoUploadService } from '../services/video-upload.service';
import { uploadActions } from './upload.actions';

@Injectable()
export class UploadEffects {
  upload$ = createEffect(() =>
    this.actions$.pipe(
      ofType(generateVideoActions.finish, uploadActions.uploadVideo),
      map((action) => {
        return action.type === generateVideoActions.finish.type
          ? [action.video]
          : action.videos;
      }),
      map((videos) => ({ ids: videos.map(({ id }) => id) })),
      mergeMap(({ ids }) => {
        const config: IUpload = {
          type: UploadType.VIDEO,
          key: 'video',
          ids,
        };
        return this.videoUploadService.upload(config).pipe(
          tap(() => this.notificationService.show('Uploading...', 'info')),
          map(() => uploadActions.inProgress({ config })),
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
          tap(() => this.notificationService.show('Done', 'success')),
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
          tap(() => this.notificationService.show('Canceled', 'info')),
          map(() => uploadActions.cancelUploadSuccess()),
          catchError((error) => of(uploadActions.uploadVideoFailure({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private readonly videoUploadService: VideoUploadService,
    private readonly notificationService: NotificationService
  ) {}
}
