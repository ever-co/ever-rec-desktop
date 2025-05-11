import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { NotificationService } from '@ever-co/notification-data-access';
import { of } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
} from 'rxjs/operators';
import { audioActions } from './audio.actions';
import { AudioService } from '../../services/audio.service';
import { isDeepEqual } from '@ever-co/shared-utils';

@Injectable()
export class AudioEffects {
  private readonly actions$ = inject(Actions);
  private readonly audioService = inject(AudioService);
  private readonly notificationService = inject(NotificationService);

  deleteAll$ = createEffect(() =>
    this.actions$.pipe(
      ofType(audioActions.deleteAudios),
      mergeMap(() =>
        this.audioService.deleteAll().pipe(
          map(() => audioActions.deleteAudiosSuccess()),
          catchError((error) => of(audioActions.deleteAudioFailure({ error }))),
        ),
      ),
    ),
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
            of(audioActions.deleteSelectedAudiosFailure({ error })),
          ),
        ),
      ),
    ),
  );

  loadAudios$ = createEffect(() =>
    this.actions$.pipe(
      ofType(audioActions.loadAudios),
      mergeMap((options) =>
        this.audioService.getAll(options).pipe(
          map((response) => audioActions.loadAudiosSuccess(response)),
          catchError((error) => of(audioActions.loadAudiosFailure({ error }))),
        ),
      ),
    ),
  );

  loadAudio$ = createEffect(() =>
    this.actions$.pipe(
      ofType(audioActions.loadAudio),
      mergeMap((options) =>
        this.audioService.getOne(options).pipe(
          map((audio) => audioActions.loadAudioSuccess({ audio })),
          catchError((error) => of(audioActions.loadAudioFailure({ error }))),
        ),
      ),
    ),
  );

  deleteAudio$ = createEffect(() =>
    this.actions$.pipe(
      ofType(audioActions.deleteAudio),
      mergeMap((audio) =>
        this.audioService.delete(audio).pipe(
          map(() => {
            this.notificationService.show('Audio deleted', 'success');
            return audioActions.deleteAudioSuccess(audio);
          }),
          catchError((error) => of(audioActions.deleteAudioFailure({ error }))),
        ),
      ),
    ),
  );

  uploadAudio$ = createEffect(() =>
    this.audioService.onUploadAudio().pipe(
      filter(Boolean),
      distinctUntilChanged(isDeepEqual.bind(this)),
      map((upload) => audioActions.updateUploadedAudio({ upload })),
    ),
  );
}
