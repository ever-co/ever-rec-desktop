import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideState } from '@ngrx/store';
import { audioPlayerFeature } from './+state/player/audio-player.reducer';
import { provideEffects } from '@ngrx/effects';
import { AudioPlayerEffects } from './+state/player/audio-player.effects';
import { AudioEffects } from './+state/crud/audio.effects';
import { audioFeature } from './+state/crud/audio.reducer';

export function provideAudioPlayerDataAccess(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideState(audioPlayerFeature),
    provideState(audioFeature),
    provideEffects(AudioPlayerEffects, AudioEffects),
  ]);
}
