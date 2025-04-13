import { Injectable } from '@angular/core';
import { LocalStorageService } from '@ever-co/shared-service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { from, of } from 'rxjs';
import { catchError, filter, map, switchMap, take } from 'rxjs/operators';
import { WebcamService } from '../service/webcam.service';
import { WebcamActions } from './webcam.actions';
import { selectCameraIsAuthorized } from './webcam.selectors';

export interface ICameraPersistance {
  isAuthorized?: boolean;
  deviceId?: string;
  tracking?: boolean;
}

@Injectable()
export class WebcamEffects {
  private readonly cameraKey = '_camera';

  loadCameras$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WebcamActions.loadWebcams),
      switchMap(() =>
        this.store.select(selectCameraIsAuthorized).pipe(
          switchMap((isAuthorized) =>
            isAuthorized
              ? from(this.webcamService.getAvailableDevices()).pipe(
                  map((webcams) =>
                    WebcamActions.loadWebcamsSuccess({ webcams })
                  ),
                  catchError((error) =>
                    of(
                      WebcamActions.loadWebcamsFailure({
                        error: this.getErrorMessage(error),
                      })
                    )
                  )
                )
              : of(WebcamActions.checkWebcamAuthorization())
          )
        )
      )
    )
  );

  authorized$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WebcamActions.checkWebcamAuthorizationSuccess),
      take(1),
      switchMap(() =>
        this.localStorageService
          .setItem<ICameraPersistance>(
            this.cameraKey,
            { isAuthorized: true },
            { merge: true }
          )
          .pipe(map(() => WebcamActions.loadWebcams()))
      )
    )
  );

  selectWebcam$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WebcamActions.selectWebcam),
      switchMap(({ deviceId, tracking = false }) =>
        this.localStorageService
          .setItem<ICameraPersistance>(
            this.cameraKey,
            { deviceId, tracking },
            { merge: true }
          )
          .pipe(
            map(() =>
              WebcamActions.selectWebcamSuccess({ deviceId, tracking })
            ),
            catchError(() =>
              of(
                WebcamActions.selectWebcamFailure({
                  error: 'Failed to select camera',
                })
              )
            )
          )
      )
    )
  );

  loadSelectedWebcam$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WebcamActions.loadWebcamsSuccess),
      switchMap(() =>
        this.localStorageService
          .getItem<ICameraPersistance>(this.cameraKey)
          .pipe(
            filter(Boolean),
            map(({ deviceId, tracking }) =>
              WebcamActions.selectWebcamSuccess({ deviceId, tracking })
            ),
            catchError(() =>
              of(
                WebcamActions.selectWebcamFailure({
                  error: 'Failed to load selected camera',
                })
              )
            )
          )
      )
    )
  );

  checkAuthorization$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WebcamActions.checkWebcamAuthorization),
      switchMap(() =>
        this.localStorageService
          .getItem<ICameraPersistance>(this.cameraKey)
          .pipe(
            filter(Boolean),
            take(1), // Complete after first emission
            switchMap((action) => {
              if (action?.isAuthorized) {
                return of(WebcamActions.checkWebcamAuthorizationSuccess());
              }

              return from(
                navigator.mediaDevices.getUserMedia({ video: true })
              ).pipe(
                switchMap((stream) => {
                  // Ensure stream is cleaned up
                  const tracks = stream.getTracks();
                  tracks.forEach((track) => track.stop());
                  return of(WebcamActions.checkWebcamAuthorizationSuccess());
                }),
                catchError((error) =>
                  of(
                    WebcamActions.checkWebcamAuthorizationFailure({
                      error: this.getErrorMessage(error),
                    })
                  )
                )
              );
            })
          )
      )
    )
  );

  private getErrorMessage(error: unknown): string {
    if (error instanceof DOMException) {
      switch (error.name) {
        case 'NotAllowedError':
          return 'Camera access was denied';
        case 'NotFoundError':
          return 'No cameras found';
        case 'NotReadableError':
          return 'Camera is already in use';
        case 'OverconstrainedError':
          return 'No camera available with the requested constraints';
        default:
          return `Camera error: ${error.message}`;
      }
    }
    return error instanceof Error ? error.message : 'Unknown error occurred';
  }

  constructor(
    private actions$: Actions,
    private store: Store,
    private readonly localStorageService: LocalStorageService,
    private readonly webcamService: WebcamService
  ) {}
}
