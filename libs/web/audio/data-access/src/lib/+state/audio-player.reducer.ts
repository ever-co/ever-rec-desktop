import { createFeature, createReducer, on } from '@ngrx/store';
import { audioPlayerActions } from './audio-player.actions';
import { IAudio } from '@ever-co/shared-utils';

export const audioPlayerFeatureKey = 'audioPlayer';

export interface IAudioPlayerState {
  currentAudio: IAudio | null;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  syncing: boolean;
  volume: number;
  isMuted: boolean;
}

export const initialAudioPlayerState: IAudioPlayerState = {
  currentAudio: null,
  currentTime: 0,
  duration: 0,
  isPlaying: false,
  volume: 1,
  isMuted: false,
  syncing: false,
};

export const reducer = createReducer(
  initialAudioPlayerState,
  on(audioPlayerActions.selectAudio, (state, { audio }) => ({
    ...state,
    currentAudio: audio,
  })),

  on(audioPlayerActions.playAudio, (state, { audio }) => ({
    ...state,
    currentAudio: audio,
    isPlaying: true,
  })),
  on(audioPlayerActions.pauseAudio, (state) => ({
    ...state,
    isPlaying: false,
  })),
  on(audioPlayerActions.togglePlayPause, (state, { audio }) => ({
    ...state,
    currentAudio: audio,
    isPlaying: !state.isPlaying,
  })),
  on(audioPlayerActions.seekAudio, (state, { time }) => ({
    ...state,
    currentTime: time,
  })),
  on(audioPlayerActions.updateVolume, (state, { volume }) => ({
    ...state,
    volume,
    isMuted: volume === 0 ? true : state.isMuted,
  })),
  on(audioPlayerActions.toggleMute, (state, { isMuted }) => ({
    ...state,
    isMuted,
  })),
  on(audioPlayerActions.updateAudioState, (state, payload) => ({
    ...state,
    ...payload,
  })),
  on(audioPlayerActions.synchronizeAudio, (state, { audio }) => ({
    ...state,
    currentAudio: state.currentAudio ?? audio,
    syncing: true,
  })),
  on(audioPlayerActions.synchronizeAudioSuccess, (state) => ({
    ...state,
    syncing: false,
  })),
  on(audioPlayerActions.synchronizeAudioFailure, (state) => ({
    ...state,
    syncing: false,
  }))
);

export const audioPlayerFeature = createFeature({
  name: audioPlayerFeatureKey,
  reducer,
});
