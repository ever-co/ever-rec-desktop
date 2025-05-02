import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { from, of } from 'rxjs';
import { catchError, concatMap, map, mergeMap } from 'rxjs/operators';
import { PhotoCaptureService } from '../../service/photo-capture.service';
import { photoCaptureActions } from './photo-capture.actions';

@Injectable()
export class PhotoCaptureEffects {
  private readonly actions$ = inject(Actions);
  savePhoto$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(photoCaptureActions.savePhoto),
      concatMap(({ dataURL, resolution }) =>
        from(this.photoCaptureService.save({ dataURL, resolution })).pipe(
          map((photo) => photoCaptureActions.savePhotoSuccess({ photo })),
          catchError((error) =>
            of(photoCaptureActions.savePhotoFailure({ error }))
          )
        )
      )
    );
  });

  startTracking$ = createEffect(() =>
    this.actions$.pipe(
      ofType(photoCaptureActions.startTracking),
      mergeMap(() =>
        this.photoCaptureService.startCapture().pipe(
          map(() => photoCaptureActions.startTrackingSuccess()),
          catchError((error) =>
            of(photoCaptureActions.startTrackingFailure({ error }))
          )
        )
      )
    )
  );

  stopTracking$ = createEffect(() =>
    this.actions$.pipe(
      ofType(photoCaptureActions.stopTracking),
      mergeMap(() =>
        this.photoCaptureService.stopCapture().pipe(
          map(() => photoCaptureActions.stopTrackingSuccess()),
          catchError((error) =>
            of(photoCaptureActions.stopTrackingFailure({ error }))
          )
        )
      )
    )
  );

  constructor(private readonly photoCaptureService: PhotoCaptureService) {}
}
