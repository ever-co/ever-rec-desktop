import { IAudio, ISelected } from '@ever-co/shared-utils';
import { createFeature, createReducer, on } from '@ngrx/store';
import { audioActions } from './audio.actions';

export const audioFeatureKey = 'audio';

export interface IAudioState {
  audios: IAudio[];
  audio: IAudio | null;
  selectedAudios: ISelected<IAudio>[];
  stream: MediaStream | null;
  saving: boolean;
  delayed: boolean;
  loading: boolean;
  deleting: boolean;
  recording: boolean;
  hasNext: boolean;
  count: number;
  error: string | null;
}

export const initialAudioState: IAudioState = {
  audios: [],
  audio: null,
  hasNext: false,
  selectedAudios: [],
  count: 0,
  saving: false,
  delayed: false,
  loading: false,
  deleting: false,
  recording: false,
  stream: null,
  error: null,
};

export const reducer = createReducer(
  initialAudioState,
  on(audioActions.saveAudio, (state) => ({
    ...state,
    saving: true,
    recording: false,
  })),
  on(audioActions.saveAudioSuccess, (state, { audio }) => ({
    ...state,
    saving: false,
    audios: [audio, ...state.audios],
    audio,
  })),
  on(audioActions.saveAudioFailure, (state, { error }) => ({
    ...state,
    saving: false,
    recording: false,
    delayed: false,
    error,
  })),

  on(audioActions.stopRecording, (state, { delayed = false }) => ({
    ...state,
    delayed,
  })),

  on(audioActions.startRecordingSuccess, (state, { stream }) => ({
    ...state,
    recording: true,
    stream,
  })),

  on(
    audioActions.stopRecordingFailure,
    audioActions.startRecordingFailure,
    (state, { error }) => ({
      ...state,
      recording: false,
      error,
    })
  ),

  on(audioActions.deleteAudios, (state) => ({
    ...state,
    deleting: true,
  })),

  on(audioActions.deleteAudiosSuccess, (state) => ({
    ...state,
    deleting: false,
    audios: [],
    audio: null,
  })),

  on(audioActions.deleteAudiosFailure, (state, { error }) => ({
    ...state,
    deleting: false,
    error,
  }))
);

export const audioFeature = createFeature({
  name: audioFeatureKey,
  reducer,
});
