import { Injectable } from '@angular/core';
import { LocalStorageService } from '@ever-co/shared-service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { from, of } from 'rxjs';
import { catchError, filter, map, switchMap, take } from 'rxjs/operators';
import { CameraService } from '../../service/camera.service';

import { ICameraPersistance } from '@ever-co/shared-utils';
import { CameraStreamService } from '../../service/camera-stream.service';
import { photoActions } from '../photo/photo.actions';
import { cameraActions } from './camera.actions';
import { selectCameraIsAuthorized } from './camera.selectors';

@Injectable()
export class CameraEffects {
  private readonly cameraKey = '_camera';

  loadCameras$ = createEffect(() =>
    this.actions$.pipe(
      ofType(cameraActions.loadCameras),
      switchMap(() =>
        this.store.select(selectCameraIsAuthorized).pipe(
          switchMap((isAuthorized) =>
            isAuthorized
              ? from(this.cameraService.availableDevices()).pipe(
                  map((cameras) =>
                    cameraActions.loadCamerasSuccess({ cameras })
                  ),
                  catchError((error) =>
                    of(
                      cameraActions.loadCamerasFailure({
                        error: this.getErrorMessage(error),
                      })
                    )
                  )
                )
              : of(cameraActions.checkCameraAuthorization())
          )
        )
      )
    )
  );

  authorized$ = createEffect(() =>
    this.actions$.pipe(
      ofType(cameraActions.checkCameraAuthorizationSuccess),
      take(1),
      switchMap(() =>
        this.localStorageService
          .setItem<ICameraPersistance>(
            this.cameraKey,
            { isAuthorized: true },
            { merge: true }
          )
          .pipe(map(() => cameraActions.loadCameras()))
      )
    )
  );

  selectCamera$ = createEffect(() =>
    this.actions$.pipe(
      ofType(cameraActions.selectCamera),
      switchMap(({ deviceId, tracking = false, resolution }) =>
        this.localStorageService
          .setItem<ICameraPersistance>(
            this.cameraKey,
            { deviceId, tracking, resolution },
            { merge: true }
          )
          .pipe(
            map(() =>
              cameraActions.selectCameraSuccess({
                deviceId,
                tracking,
                resolution,
              })
            ),
            catchError(() =>
              of(
                cameraActions.selectCameraFailure({
                  error: 'Failed to select camera',
                })
              )
            )
          )
      )
    )
  );

  loadSelectedCamera$ = createEffect(() =>
    this.actions$.pipe(
      ofType(cameraActions.loadCamerasSuccess),
      switchMap(({ cameras }) =>
        this.localStorageService
          .getItem<ICameraPersistance>(this.cameraKey)
          .pipe(
            filter(Boolean),
            map(({ deviceId, tracking, resolution }) =>
              cameraActions.selectCameraSuccess({
                deviceId: deviceId ?? cameras[0]?.deviceId ?? null,
                resolution,
                tracking,
              })
            ),
            catchError(() =>
              of(
                cameraActions.selectCameraFailure({
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
      ofType(cameraActions.checkCameraAuthorization),
      switchMap(() =>
        this.localStorageService
          .getItem<ICameraPersistance>(this.cameraKey)
          .pipe(
            take(1), // Complete after first emission
            switchMap((action) => {
              if (action?.isAuthorized) {
                return of(cameraActions.checkCameraAuthorizationSuccess());
              }
              return from(this.cameraStreamService.createStream()).pipe(
                switchMap((stream) =>
                  // Ensure stream is cleaned up
                  of(this.cameraStreamService.closeStream(stream)).pipe(
                    map(() => cameraActions.checkCameraAuthorizationSuccess())
                  )
                ),
                catchError((error) =>
                  of(
                    cameraActions.checkCameraAuthorizationFailure({
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

  takePhoto$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(cameraActions.takePhoto),
        map(({ dataURL }) => photoActions.savePhoto({ dataURL }))
      ),
    { dispatch: false }
  );

  createStream$ = createEffect(() =>
    this.actions$.pipe(
      ofType(cameraActions.createCameraStream),
      switchMap(({ deviceId, stream, resolution }) =>
        from(
          this.cameraStreamService.createStream({
            deviceId,
            stream,
            resolution,
          })
        ).pipe(
          map((stream) => cameraActions.createCameraStreamSuccess({ stream })),
          catchError((error) =>
            of(
              cameraActions.createCameraStreamFailure({
                error: this.getErrorMessage(error),
              })
            )
          )
        )
      )
    )
  );

  closeStream$ = createEffect(() =>
    this.actions$.pipe(
      ofType(cameraActions.closeCameraStream),
      switchMap(({ stream }) =>
        of(this.cameraStreamService.closeStream(stream))
          .pipe(map(() => cameraActions.closeCameraStreamSuccess()))
          .pipe(
            catchError((error) =>
              of(
                cameraActions.closeCameraStreamFailure({
                  error: this.getErrorMessage(error),
                })
              )
            )
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
    private readonly cameraService: CameraService,
    private readonly cameraStreamService: CameraStreamService
  ) {}
}
