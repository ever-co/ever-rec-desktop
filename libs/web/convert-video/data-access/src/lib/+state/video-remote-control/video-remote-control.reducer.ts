import { createFeature, createReducer, on } from '@ngrx/store';
import { videoRemoteControlActions } from './video-remote-control.actions';

export const videoRemoteControlFeatureKey = 'videoRemoteControl';

export interface IVideoRemoteControlState {
  scrollPercentage: number;
  currentTime: number;
}

export const initialVideoState: IVideoRemoteControlState = {
  scrollPercentage: 0,
  currentTime: 0,
};

const reducer = createReducer(
  initialVideoState,
  on(
    videoRemoteControlActions.setScrollPercentage,
    (state, { percentage }) => ({
      ...state,
      scrollPercentage: percentage,
    })
  ),
  on(videoRemoteControlActions.setVideoTime, (state, { currentTime }) => ({
    ...state,
    currentTime,
  }))
);

export const videoRemoteControlFeature = createFeature({
  name: videoRemoteControlFeatureKey,
  reducer,
});
