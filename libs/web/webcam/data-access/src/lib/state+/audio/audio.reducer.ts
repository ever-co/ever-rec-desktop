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
    delayed: false,
    error,
  })),

  on(audioActions.stopRecording, (state, { delayed = false }) => ({
    ...state,
    delayed,
  })),

  on(audioActions.stopRecordingSuccess, (state) => ({
    ...state,
    saving: true,
    recording: false,
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
  })),

  // Delete selected audios
  on(audioActions.deleteSelectedAudios, (state) => ({
    ...state,
    deleting: true,
    error: '',
  })),
  on(audioActions.deleteSelectedAudiosSuccess, (state, { audios }) => {
    const audioIdsDeleted = audios.map((audio) => audio.id);

    // Filter out deleted audios
    const updatedAudios = state.audios.filter(
      (audio) => !audioIdsDeleted.includes(audio.id)
    );

    return {
      ...state,
      audios: updatedAudios,
      deleting: false,
    };
  }),

  on(audioActions.deleteSelectedAudiosFailure, (state, { error }) => ({
    ...state,
    deleting: false,
    error,
  })),

  // Select Audio
  on(audioActions.selectAudio, (state, { audio }) => ({
    ...state,
    selectedAudios: [
      ...new Map(
        [...state.selectedAudios, audio].map((item) => [item, item])
      ).values(),
    ].filter((audio) => audio.selected),
  })),

  // Unselect Audio
  on(audioActions.unselectAudio, (state, { audio }) => ({
    ...state,
    selectedAudios: state.selectedAudios.filter(
      ({ data }) => audio.data.id !== data.id
    ),
  })),

  // Unselect All Audios
  on(audioActions.unselectAllAudios, (state) => ({
    ...state,
    deleting: false,
    selectedAudios: [],
  })),

  // Reset Audios
  on(audioActions.resetAudios, (state) => ({
    ...state,
    audios: initialAudioState.audios,
  })),

  on(audioActions.loadAudio, (state) => ({
    ...state,
    loading: true,
  })),

  on(audioActions.loadAudioSuccess, (state, { audio }) => ({
    ...state,
    loading: false,
    audio,
  })),

  on(audioActions.loadAudioFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(audioActions.loadAudios, (state) => ({
    ...state,
    loading: true,
  })),

  on(audioActions.loadAudiosSuccess, (state, { data, hasNext, count }) => ({
    ...state,
    count,
    hasNext,
    audios: [
      ...new Map(
        [...state.audios, ...data].map((item) => [item.id, item])
      ).values(),
    ],
    loading: false,
    error: '',
  })),

  on(audioActions.loadAudiosFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);

export const audioFeature = createFeature({
  name: audioFeatureKey,
  reducer,
});
