import { inject, Injectable } from '@angular/core';
import { generateVideoActions } from '@ever-co/generate-video-data-access';
import { AppWindowId, isDeepEqual, MessageType } from '@ever-co/shared-utils';
import {
  audioRecordingActions,
  photoCaptureActions,
} from '@ever-co/webcam-data-access';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { distinctUntilChanged, filter, tap } from 'rxjs/operators';
import { MediatorService } from '../mediator.service';

import { screenshotActions } from '@ever-co/screenshot-data-access';

@Injectable()
export class MediatorEffects {
  private store = inject(Store);
  private actions$ = inject(Actions);
  private mediatorService = inject(MediatorService);
  // Sync specific actions to other windows
  mainWindowSync$ = createEffect(
    () =>
      this.actions$.pipe(
        // Filter for actions that should be synced
        ofType(
          generateVideoActions.finish,
          screenshotActions.stopCaptureSuccess,
        ),
        // Filter for actions that should be synced
        distinctUntilChanged(isDeepEqual.bind(this)),
        // Send the action to the electron mediator
        tap((action) => {
          this.mediatorService.send({
            message: {
              payload: action,
              type: MessageType.STATE_SYNC,
              metadata: {
                timestamp: new Date().getDate(),
                source: AppWindowId.MAIN,
              },
            },
            sourceId: AppWindowId.MAIN,
          });
        }),
      ),
    { dispatch: false },
  );

  // Sync specific actions to other windows
  steamingWindowSync$ = createEffect(
    () =>
      this.actions$.pipe(
        // Filter for actions that should be synced
        ofType(
          audioRecordingActions.startRecordingSuccess,
          audioRecordingActions.stopRecordingSuccess,
          photoCaptureActions.startTrackingSuccess,
          audioRecordingActions.saveAudioSuccess,
        ),
        // Filter for actions that should be synced
        distinctUntilChanged(isDeepEqual.bind(this)),
        // Send the action to the electron mediator
        tap((action) => {
          this.mediatorService.send({
            message: {
              payload: action,
              type: MessageType.STATE_SYNC,
              metadata: {
                timestamp: new Date().getDate(),
                source: AppWindowId.STREAMING,
              },
            },
            sourceId: AppWindowId.STREAMING,
          });
        }),
      ),
    { dispatch: false },
  );

  // Listen for remote actions from other windows
  remoteActions$ = createEffect(
    () =>
      this.mediatorService.receive().pipe(
        // Filter for actions that should be synced
        filter(Boolean),
        // Distinct the remote action to the local store
        distinctUntilChanged(isDeepEqual.bind(this)),
        // Dispatch the remote action to the local store
        tap((message) => {
          this.store.dispatch({ ...message.payload });
        }),
      ),
    { dispatch: false },
  );
}
