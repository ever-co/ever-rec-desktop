import { IAudio } from '@ever-co/shared-utils';
import { createFeature, createReducer, on } from '@ngrx/store';
import { audioRecordingActions } from './audio-recording.actions';

export const audioRecordingFeatureKey = 'audioRecording';

export interface IAudioRecordingState {
  audio: IAudio | null;
  stream: MediaStream | null;
  saving: boolean;
  delayed: boolean;
  loading: boolean;
  recording: boolean;
  error: string | null;
}

export const initialAudioState: IAudioRecordingState = {
  audio: null,
  saving: false,
  delayed: false,
  loading: false,
  recording: false,
  stream: null,
  error: null,
};

export const reducer = createReducer(
  initialAudioState,
  on(audioRecordingActions.saveAudio, (state) => ({
    ...state,
    saving: true,
  })),
  on(audioRecordingActions.saveAudioSuccess, (state, { audio }) => ({
    ...state,
    saving: false,
    audio,
  })),
  on(audioRecordingActions.saveAudioFailure, (state, { error }) => ({
    ...state,
    saving: false,
    delayed: false,
    error,
  })),

  on(audioRecordingActions.stopRecording, (state, { delayed = false }) => ({
    ...state,
    delayed,
  })),

  on(audioRecordingActions.stopRecordingSuccess, (state) => ({
    ...state,
    saving: true,
    recording: false,
  })),

  on(audioRecordingActions.startRecordingSuccess, (state, { stream }) => ({
    ...state,
    recording: true,
    stream,
  })),

  on(
    audioRecordingActions.stopRecordingFailure,
    audioRecordingActions.startRecordingFailure,
    (state, { error }) => ({
      ...state,
      recording: false,
      error,
    })
  ),
);

export const audioRecordingFeature = createFeature({
  name: audioRecordingFeatureKey,
  reducer,
});
