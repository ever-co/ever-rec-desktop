import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { AudioRecorderService } from '../../service/audio-recorder.service';
import { AudioService } from '../../service/audio.service';
import { cameraActions } from '../camera/camera.actions';
import { audioActions } from './audio.actions';
import { generateVideoActions } from '@ever-co/convert-video-data-access';
import { AudioWorkerService } from '../../service/audio-woker.service';

@Injectable()
export class AudioEffects {
  processAudio$ = createEffect(() =>
    this.actions$.pipe(
      ofType(generateVideoActions.finish),
      mergeMap(() =>
        this.audioWorkerService.processAudio().pipe(
          map((audio) => audioActions.saveAudio(audio)),
          catchError((error) => of(audioActions.saveAudioFailure({ error })))
        )
      )
    )
  );

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
      ofType(
        audioActions.startRecording,
        cameraActions.createCameraStreamSuccess
      ),
      map(({ stream }) => audioActions.startRecordingSuccess({ stream })),
      catchError((error) => of(audioActions.startRecordingFailure({ error })))
    )
  );

  recording$ = createEffect(() =>
    this.actions$.pipe(
      ofType(audioActions.startRecordingSuccess),
      mergeMap(({ stream }) =>
        this.audioRecorderService.start(stream).pipe(
          map((audio) => audioActions.saveAudio(audio)),
          catchError((error) => of(audioActions.saveAudioFailure({ error })))
        )
      )
    )
  );

  stopRecording$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        cameraActions.closeCameraStreamSuccess,
        audioActions.stopRecording
      ),
      mergeMap(() =>
        of(this.audioRecorderService.stop()).pipe(
          map(() => audioActions.stopRecordingSuccess()),
          catchError((error) =>
            of(audioActions.stopRecordingFailure({ error }))
          )
        )
      )
    )
  );

  deleteAll$ = createEffect(() =>
    this.actions$.pipe(
      ofType(audioActions.deleteAudios),
      mergeMap(() =>
        this.audioService.deleteAllPhoto().pipe(
          map(() => audioActions.deleteAudiosSuccess()),
          catchError((error) => of(audioActions.deleteAudioFailure({ error })))
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
