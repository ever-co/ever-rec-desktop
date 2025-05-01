import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { generateVideoActions } from '@ever-co/convert-video-data-access';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { AudioRecorderService } from '../../service/audio-recorder.service';
import { AudioWorkerService } from '../../service/audio-woker.service';
import { AudioService } from '../../service/audio.service';
import { cameraActions } from '../camera/camera.actions';
import { audioRecordingActions } from './audio-recording.actions';

@Injectable()
export class AudioRecordingEffects {
  processAudio$ = createEffect(() =>
    this.actions$.pipe(
      ofType(generateVideoActions.finish),
      mergeMap(({ video }) =>
        this.audioWorkerService.processAudio().pipe(
          map((audio) =>
            audioRecordingActions.saveAudio({
              ...audio,
              videoId: video.id,
            })
          ),
          catchError((error) => of(audioRecordingActions.saveAudioFailure({ error })))
        )
      )
    )
  );

  saveAudio$ = createEffect(() =>
    this.actions$.pipe(
      ofType(audioRecordingActions.saveAudio),
      mergeMap((options) =>
        this.audioService.save(options).pipe(
          map((audio) => audioRecordingActions.saveAudioSuccess({ audio })),
          catchError((error) => of(audioRecordingActions.saveAudioFailure({ error })))
        )
      )
    )
  );

  startRecording$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        audioRecordingActions.startRecording,
        cameraActions.createCameraStreamSuccess
      ),
      map(({ stream }) => audioRecordingActions.startRecordingSuccess({ stream })),
      catchError((error) => of(audioRecordingActions.startRecordingFailure({ error })))
    )
  );

  recording$ = createEffect(() =>
    this.actions$.pipe(
      ofType(audioRecordingActions.startRecordingSuccess),
      mergeMap(({ stream }) =>
        this.audioRecorderService.start(stream).pipe(
          map((audio) => audioRecordingActions.saveAudio(audio)),
          catchError((error) => of(audioRecordingActions.saveAudioFailure({ error })))
        )
      )
    )
  );

  stopRecording$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        cameraActions.closeCameraStreamSuccess,
        audioRecordingActions.stopRecording
      ),
      mergeMap(() =>
        of(this.audioRecorderService.stop()).pipe(
          map(() => audioRecordingActions.stopRecordingSuccess()),
          catchError((error) =>
            of(audioRecordingActions.stopRecordingFailure({ error }))
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private readonly audioService: AudioService,
    private readonly audioRecorderService: AudioRecorderService,
    private readonly audioWorkerService: AudioWorkerService
  ) {}
}
