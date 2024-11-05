import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { NotificationService } from '@ever-co/notification-data-access';
import { of } from 'rxjs';
import { catchError, concatMap, map, switchMap, tap } from 'rxjs/operators';
import { VideoUploadService } from '../../services/video-upload.service';
import { uploadActions } from './upload.actions';

@Injectable()
export class UploadEffects {
  upload$ = createEffect(() =>
    this.actions$.pipe(
      ofType(uploadActions.uploadVideo),
      tap(() => this.notificationService.show('Uploading...', 'info')),
      concatMap(({ config }) =>
        this.videoUploadService.upload(config).pipe(
          map(() => uploadActions.inProgress()),
          catchError((error) => of(uploadActions.uploadVideoFailure({ error })))
        )
      )
    )
  );

  onError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(uploadActions.uploadVideo),
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
