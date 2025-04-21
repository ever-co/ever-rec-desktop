import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { AudioService } from '../../service/audio.service';
import { audioActions } from './audio.actions';
import { cameraActions } from '../camera/camera.actions';
import { AudioRecorderService } from '../../service/audio-recorder.service';

@Injectable()
export class AudioEffects {
  saveAudio$ = createEffect(() =>
    this.actions$.pipe(
      ofType(audioActions.saveAudio),
      mergeMap((options) =>
        this.audioService.save(options).pipe(
          map((audio) => audioActions.saveAudioSuccess({ audio })),
          catchError((error) => of(audioActions.saveAudioFailure({ error })))
        )
      )
    )
  );

  startRecording$ = createEffect(() =>
    this.actions$.pipe(
      ofType(cameraActions.createCameraStreamSuccess),
      mergeMap(({ stream }) =>
        this.audioRecorderService.start(stream).pipe(
          map((arrayBuffer) => audioActions.saveAudio({ arrayBuffer })),
          catchError((error) => of(audioActions.saveAudioFailure({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private readonly audioService: AudioService,
    private readonly audioRecorderService: AudioRecorderService
  ) {}
}
