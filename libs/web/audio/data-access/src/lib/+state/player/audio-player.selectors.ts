import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAudioPlayer from './audio-player.reducer';

export const selectAudioPlayerState =
  createFeatureSelector<fromAudioPlayer.IAudioPlayerState>(
    fromAudioPlayer.audioPlayerFeatureKey
  );

export const selectCurrentAudio = createSelector(
  selectAudioPlayerState,
  (state) => state.currentAudio
);

export const selectCurrentTime = createSelector(
  selectAudioPlayerState,
  (state) => state.currentTime
);

export const selectDuration = createSelector(
  selectAudioPlayerState,
  (state) => state.duration
);

export const selectIsPlaying = createSelector(
  selectAudioPlayerState,
  (state) => state.isPlaying
);

export const selectVolume = createSelector(
  selectAudioPlayerState,
  (state) => state.volume
);

export const selectIsMuted = createSelector(
  selectAudioPlayerState,
  (state) => state.isMuted
);

export const selectProgressPercentage = createSelector(
  selectCurrentTime,
  selectDuration,
  (currentTime, duration) => (duration > 0 ? (currentTime / duration) * 100 : 0)
);

export const selectCurrentTimeFormatted = createSelector(
  selectCurrentTime,
  (currentTime) => formatTime(currentTime)
);

export const selectDurationFormatted = createSelector(
  selectDuration,
  (duration) => formatTime(duration)
);

export const selectRemainingTimeFormatted = createSelector(
  selectCurrentTime,
  selectDuration,
  (currentTime, duration) => formatTime(Math.max(0, duration - currentTime))
);

function formatTime(seconds: number): string {
  if (isNaN(seconds) || !isFinite(seconds)) return '0:00';

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}
