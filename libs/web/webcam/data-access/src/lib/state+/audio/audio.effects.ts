import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { generateVideoActions } from '@ever-co/convert-video-data-access';
import { NotificationService } from '@ever-co/notification-data-access';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { AudioRecorderService } from '../../service/audio-recorder.service';
import { AudioWorkerService } from '../../service/audio-woker.service';
import { AudioService } from '../../service/audio.service';
import { cameraActions } from '../camera/camera.actions';
import { audioActions } from './audio.actions';

@Injectable()
export class AudioEffects {
  processAudio$ = createEffect(() =>
    this.actions$.pipe(
      ofType(generateVideoActions.finish),
      mergeMap(({ video }) =>
        this.audioWorkerService.processAudio().pipe(
          map((audio) =>
            audioActions.saveAudio({
              ...audio,
              videoId: video.id,
            })
          ),
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
        this.audioService.deleteAll().pipe(
          map(() => audioActions.deleteAudiosSuccess()),
          catchError((error) => of(audioActions.deleteAudioFailure({ error })))
        )
      )
    )
  );

  deleteSelectedAudios$ = createEffect(() =>
    this.actions$.pipe(
      ofType(audioActions.deleteSelectedAudios),
      mergeMap(({ audios }) =>
        this.audioService.deleteAll(audios).pipe(
          map(() => {
            this.notificationService.show('Selected audios deleted', 'success');
            return audioActions.deleteSelectedAudiosSuccess({
              audios,
            });
          }),
          catchError((error) =>
            of(audioActions.deleteSelectedAudiosFailure({ error }))
          )
        )
      )
    )
  );

  loadAudios$ = createEffect(() =>
    this.actions$.pipe(
      ofType(audioActions.loadAudios),
      mergeMap((options) =>
        this.audioService.getAll(options).pipe(
          map((response) => audioActions.loadAudiosSuccess(response)),
          catchError((error) => of(audioActions.loadAudiosFailure({ error })))
        )
      )
    )
  );

  loadAudio$ = createEffect(() =>
    this.actions$.pipe(
      ofType(audioActions.loadAudio),
      mergeMap((options) =>
        this.audioService.getOne(options).pipe(
          map((audio) => audioActions.loadAudioSuccess({ audio })),
          catchError((error) => of(audioActions.loadAudioFailure({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private readonly audioService: AudioService,
    private readonly audioRecorderService: AudioRecorderService,
    private readonly audioWorkerService: AudioWorkerService,
    private readonly notificationService: NotificationService
  ) {}
}
