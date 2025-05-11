import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { NotificationService } from '@ever-co/notification-data-access';
import { from, of } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
} from 'rxjs/operators';
import { photoActions } from './photo.actions';
import { PhotoService } from '../services/photo.service';
import { isDeepEqual } from '@ever-co/shared-utils';

@Injectable()
export class PhotoEffects {
  private readonly actions$ = inject(Actions);

  loadPhotos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(photoActions.loadPhotos),
      mergeMap((options) =>
        from(this.photoService.getAllPhotos(options)).pipe(
          map((response) => photoActions.loadPhotosSuccess(response)),
          catchError((error) => of(photoActions.loadPhotosFailure({ error }))),
        ),
      ),
    ),
  );

  loadPhoto$ = createEffect(() =>
    this.actions$.pipe(
      ofType(photoActions.loadPhoto),
      mergeMap((options) =>
        from(this.photoService.getOnePhoto(options)).pipe(
          map((photo) => photoActions.loadPhotoSuccess({ photo })),
          catchError((error) => of(photoActions.loadPhotoFailure({ error }))),
        ),
      ),
    ),
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
          catchError((error) => of(photoActions.deletePhotoFailure({ error }))),
        ),
      ),
    ),
  );

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
            of(photoActions.deleteSelectedPhotosFailure({ error })),
          ),
        ),
      ),
    ),
  );

  deletePhotos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(photoActions.deletePhotos),
      mergeMap(() =>
        from(this.photoService.deleteAllPhoto()).pipe(
          map(() => photoActions.deletePhotosSuccess()),
          catchError((error) =>
            of(photoActions.deletePhotosFailure({ error })),
          ),
        ),
      ),
    ),
  );

  uploadPhoto$ = createEffect(() =>
    this.photoService.onUploadPhoto().pipe(
      filter(Boolean),
      distinctUntilChanged(isDeepEqual.bind(this)),
      map((upload) => photoActions.updateUploadedPhoto({ upload })),
    ),
  );

  constructor(
    private readonly photoService: PhotoService,
    private readonly notificationService: NotificationService,
  ) {}
}
