import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAudio from './audio.reducer';

export const selectAudioState = createFeatureSelector<fromAudio.IAudioState>(
  fromAudio.audioFeatureKey
);

export const selectRecordingState = createSelector(
  selectAudioState,
  (state) => state.recording
);

export const selectAudioKillSwitch = createSelector(
  selectAudioState,
  (state) => state.delayed && !state.recording && !state.saving
);
