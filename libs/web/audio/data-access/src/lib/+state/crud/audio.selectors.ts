import { createFeatureSelector } from '@ngrx/store';
import * as fromAudio from './audio.reducer';

export const selectAudioState = createFeatureSelector<fromAudio.IAudioState>(
  fromAudio.audioFeatureKey
);
