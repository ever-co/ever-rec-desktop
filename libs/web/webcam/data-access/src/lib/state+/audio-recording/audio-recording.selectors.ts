import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAudioRecording from './audio-recording.reducer';

export const selectAudioState = createFeatureSelector<fromAudioRecording.IAudioRecordingState>(
  fromAudioRecording.audioRecordingFeatureKey
);

export const selectRecordingState = createSelector(
  selectAudioState,
  (state) => state.recording
);

export const selectAudioKillSwitch = createSelector(
  selectAudioState,
  (state) => state.delayed && !state.recording && !state.saving
);
