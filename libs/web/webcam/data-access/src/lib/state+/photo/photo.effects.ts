import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, from, Observable, of } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';
import { PhotoService } from '../../service/photo.service';
import { photoActions } from './photo.actions';

@Injectable()
export class PhotoEffects {
  loadPhotos$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(photoActions.loadPhotos),
      /** An EMPTY observable only emits completion. Replace with your own observable API request */
      concatMap(() => EMPTY as Observable<{ type: string }>)
    );
  });

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

  constructor(
    private actions$: Actions,
    private readonly photoService: PhotoService
  ) {}
}
