import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { NotificationService } from '@ever-co/notification-data-access';
import { from, of } from 'rxjs';
import { catchError, concatMap, map, mergeMap } from 'rxjs/operators';
import { PhotoService } from '../../service/photo.service';
import { photoActions } from './photo.actions';

@Injectable()
export class PhotoEffects {
  loadPhotos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(photoActions.loadPhotos),
      mergeMap((options) =>
        from(this.photoService.getAllPhotos(options)).pipe(
          map((response) => photoActions.loadPhotosSuccess(response)),
          catchError((error) => of(photoActions.loadPhotosFailure({ error })))
        )
      )
    )
  );

  loadPhoto$ = createEffect(() =>
    this.actions$.pipe(
      ofType(photoActions.loadPhoto),
      mergeMap((options) =>
        from(this.photoService.getOnePhoto(options)).pipe(
          map((photo) => photoActions.loadPhotoSuccess({ photo })),
          catchError((error) => of(photoActions.loadPhotoFailure({ error })))
        )
      )
    )
  );

  deletePhotot$ = createEffect(() =>
    this.actions$.pipe(
      ofType(photoActions.deletePhoto),
      mergeMap((photo) =>
        from(this.photoService.deletePhoto(photo)).pipe(
          map(() => {
            this.notificationService.show('Photo deleted', 'success');
            return photoActions.deletePhotoSuccess(photo);
          }),
          catchError((error) => of(photoActions.deletePhotoFailure({ error })))
        )
      )
    )
  );

  savePhoto$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(photoActions.savePhoto),
      concatMap(({ dataURL, resolution }) =>
        from(this.photoService.save({ dataURL, resolution })).pipe(
          map((photo) => photoActions.savePhotoSuccess({ photo })),
          catchError((error) => of(photoActions.savePhotoFailure({ error })))
        )
      )
    );
  });

  deleteSelectedScreenshots$ = createEffect(() =>
    this.actions$.pipe(
      ofType(photoActions.deleteSelectedPhotos),
      mergeMap(({ photos }) =>
        from(this.photoService.deleteAllPhoto(photos)).pipe(
          map(() => {
            this.notificationService.show('Selected photos deleted', 'success');
            return photoActions.deleteSelectedPhotosSuccess({
              photos,
            });
          }),
          catchError((error) =>
            of(photoActions.deleteSelectedPhotosFailure({ error }))
          )
        )
      )
    )
  );

  stopTracking$ = createEffect(() =>
    this.actions$.pipe(
      ofType(photoActions.stopTracking),
      mergeMap(() =>
        this.photoService.stopCapture().pipe(
          map(() => photoActions.stopTrackingSuccess()),
          catchError((error) => of(photoActions.stopTrackingFailure({ error })))
        )
      )
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly photoService: PhotoService,
    private readonly notificationService: NotificationService
  ) {}
}
