import { inject, Injectable } from '@angular/core';
import { LocalStorageService } from '@ever-co/shared-service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { defer, forkJoin, from, iif, Observable, of } from 'rxjs';
import {
  catchError,
  filter,
  map,
  switchMap,
  take,
  withLatestFrom,
} from 'rxjs/operators';
import { CameraService } from '../../service/camera.service';

import { ICameraPersistance } from '@ever-co/shared-utils';
import { CameraStreamService } from '../../service/camera-stream.service';
import { cameraActions } from './camera.actions';
import { selectCameraIsAuthorized } from './camera.selectors';
import { AudioService } from '../../service/audio.service';

@Injectable()
export class CameraEffects {
  private readonly cameraKey = '_camera';
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);

  public loadCameras$ = createEffect(() =>
    this.actions$.pipe(
      ofType(cameraActions.loadCameras),
      withLatestFrom(this.store.select(selectCameraIsAuthorized)),
      switchMap(([, isAuthorized]) =>
        iif(
          () => isAuthorized,
          this.loadAuthorizedDevices(),
          of(cameraActions.checkCameraAuthorization())
        )
      )
    )
  );

  private loadAuthorizedDevices(): Observable<Action> {
    return defer(() =>
      forkJoin([
        this.cameraService.availableDevices(),
        this.audioService.availableDevices(),
      ]).pipe(
        map(([cameras, microphones]) =>
          cameraActions.loadCamerasSuccess({ cameras, microphones })
        ),
        catchError((error) =>
          of(
            cameraActions.loadCamerasFailure({
              error: this.getErrorMessage(error),
            })
          )
        )
      )
    );
  }

  public authorized$ = createEffect(() =>
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

  public selectCamera$ = createEffect(() =>
    this.actions$.pipe(
      ofType(cameraActions.selectCamera),
      switchMap(
        ({
          deviceId,
          canUseCamera = false,
          canUseMicrophone = false,
          resolution,
          microphoneId,
        }) =>
          this.localStorageService
            .setItem<ICameraPersistance>(
              this.cameraKey,
              {
                deviceId,
                canUseCamera,
                canUseMicrophone,
                resolution,
                microphoneId,
              },
              { merge: true }
            )
            .pipe(
              map(() =>
                cameraActions.selectCameraSuccess({
                  deviceId,
                  canUseCamera,
                  canUseMicrophone,
                  resolution,
                  microphoneId,
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

  public loadSelectedCamera$ = createEffect(() =>
    this.actions$.pipe(
      ofType(cameraActions.loadCamerasSuccess),
      switchMap(({ cameras, microphones }) =>
        this.localStorageService
          .getItem<ICameraPersistance>(this.cameraKey)
          .pipe(
            filter(Boolean),
            map(
              ({
                deviceId,
                canUseCamera,
                canUseMicrophone,
                resolution,
                microphoneId,
              }) =>
                cameraActions.selectCameraSuccess({
                  deviceId: deviceId ?? cameras[0]?.deviceId ?? null,
                  microphoneId:
                    microphoneId ?? microphones[0]?.deviceId ?? null,
                  canUseCamera,
                  canUseMicrophone,
                  resolution,
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

  public checkAuthorization$ = createEffect(() =>
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

  public createStream$ = createEffect(() =>
    this.actions$.pipe(
      ofType(cameraActions.createCameraStream),
      switchMap(
        ({ deviceId, stream, resolution, canUseCamera, canUseMicrophone }) =>
          from(
            this.cameraStreamService.createStream({
              deviceId,
              stream,
              resolution,
              canUseCamera,
              canUseMicrophone,
            })
          ).pipe(
            map((stream) =>
              cameraActions.createCameraStreamSuccess({ stream })
            ),
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

  public closeStream$ = createEffect(() =>
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
    private readonly localStorageService: LocalStorageService,
    private readonly cameraService: CameraService,
    private readonly audioService: AudioService,
    private readonly cameraStreamService: CameraStreamService
  ) {}
}
