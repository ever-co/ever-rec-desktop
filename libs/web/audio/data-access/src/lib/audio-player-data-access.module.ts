import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideState } from '@ngrx/store';
import { audioPlayerFeature } from './+state/audio-player.reducer';

export function provideAudioPlayerDataAccess(): EnvironmentProviders {
  return makeEnvironmentProviders([provideState(audioPlayerFeature)]);
}
