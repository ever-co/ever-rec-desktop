import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { delay, tap } from 'rxjs/operators';
import { AudioPlayerSyncService } from '../../services/audio-player-sync.service';
import { audioPlayerActions } from './audio-player.actions';

@Injectable()
export class AudioPlayerEffects {
  private readonly actions$ = inject(Actions);
  private readonly synchronizeService = inject(AudioPlayerSyncService);

  synchronizeAudio$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(audioPlayerActions.synchronizeAudio),
        delay(100),
        tap(({ audio, kind, ratio }) => {
          if (kind === 'seek' && ratio) {
            this.synchronizeService.synchronizeSeek({ audio, ratio });
          }
          if (kind === 'play') {
            this.synchronizeService.synchronizePlayPause(audio);
          }
        })
      ),
    { dispatch: false }
  );
}
