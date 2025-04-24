import { Injectable } from '@angular/core';
import { generateVideoActions } from '@ever-co/convert-video-data-access';
import {
  AppWindowId,
  IMessage,
  isDeepEqual,
  MessageType,
} from '@ever-co/shared-utils';
import { audioActions, photoActions } from '@ever-co/webcam-data-access';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { distinctUntilChanged, filter, map, tap } from 'rxjs/operators';
import { MediatorService } from '../mediator.service';

@Injectable()
export class MediatorEffects {
  // Sync specific actions to other windows
  mainWindowSync$ = createEffect(
    () =>
      this.actions$.pipe(
        // Filter for actions that should be synced
        ofType(generateVideoActions.finish),
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
        })
      ),
    { dispatch: false }
  );

  // Sync specific actions to other windows
  steamingWindowSync$ = createEffect(
    () =>
      this.actions$.pipe(
        // Filter for actions that should be synced
        ofType(
          audioActions.startRecordingSuccess,
          audioActions.stopRecordingSuccess,
          photoActions.startTrackingSuccess,
          audioActions.saveAudioSuccess
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
        })
      ),
    { dispatch: false }
  );

  // Listen for remote actions from other windows
  remoteActions$ = createEffect(
    () =>
      this.mediatorService.receive().pipe(
        map((action: any) => action[1] as IMessage),
        // Filter for actions that should be synced
        filter(Boolean),
        // Distinct the remote action to the local store
        distinctUntilChanged(isDeepEqual.bind(this)),
        // Dispatch the remote action to the local store
        tap((message) => {
          console.log(message);
          this.store.dispatch({ ...message.payload });
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private mediatorService: MediatorService
  ) {}
}
