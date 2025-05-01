import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { delay, tap } from 'rxjs/operators';
import { AudioPlayerSyncService } from '../../services/audio-player-sync.service';
import { audioPlayerActions } from './audio-player.actions';

@Injectable()
export class AudioPlayerEffects {
  synchronizeAudio$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(audioPlayerActions.synchronizeAudio),
        delay(100),
        tap(({ audio }) => this.synchronizeService.synchronize(audio))
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private readonly synchronizeService: AudioPlayerSyncService
  ) {}
}
