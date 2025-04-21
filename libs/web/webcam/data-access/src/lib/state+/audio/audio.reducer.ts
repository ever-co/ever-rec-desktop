import { createFeature, createReducer, on } from '@ngrx/store';
import { audioActions } from './audio.actions';
import { IAudio, ISelected } from '@ever-co/shared-utils';
import { cameraActions } from '../camera/camera.actions';

export const audioFeatureKey = 'audio';

export interface IAudioState {
  audios: IAudio[];
  audio: IAudio | null;
  selectedPhotos: ISelected<IAudio>[];
  stream: MediaStream | null;
  saving: boolean;
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
  selectedPhotos: [],
  count: 0,
  saving: false,
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
    error,
  })),

  on(audioActions.startRecordingSuccess, (state, { stream }) => ({
    ...state,
    recording: true,
    stream,
  })),

  on(
    cameraActions.closeCameraStreamSuccess,
    audioActions.stopRecordingSuccess,
    (state) => ({
      ...state,
      recording: false,
    })
  ),

  on(
    audioActions.stopRecordingFailure,
    audioActions.startRecordingFailure,
    (state, { error }) => ({
      ...state,
      recording: false,
      error,
    })
  )
);

export const audioFeature = createFeature({
  name: audioFeatureKey,
  reducer,
});
