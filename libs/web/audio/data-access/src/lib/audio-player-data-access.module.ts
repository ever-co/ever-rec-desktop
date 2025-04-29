import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideState } from '@ngrx/store';
import { audioPlayerFeature } from './+state/audio-player.reducer';
import { provideEffects } from '@ngrx/effects';
import { AudioPlayerEffects } from './+state/audio-player.effects';

export function provideAudioPlayerDataAccess(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideState(audioPlayerFeature),
    provideEffects(AudioPlayerEffects),
  ]);
}
