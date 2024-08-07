import { IVideo } from '@ever-capture/shared/utils';
import { createFeature, createReducer, on } from '@ngrx/store';
import { generateVideoActions } from './generate-video.actions';

export const generateVideoFeatureKey = 'generateVideo';

export interface State {
  progress: number;
  generating: boolean;
  error: string;
  video: IVideo;
}

export const initialState: State = {
  progress: 0,
  generating: false,
  video: {} as IVideo,
  error: '',
};

export const reducer = createReducer(
  initialState,
  on(generateVideoActions.start, (state) => ({
    ...state,
    error: '',
    generating: true,
  })),
  on(generateVideoActions.cancel, (state) => ({
    ...state,
    generating: false,
  })),
  on(generateVideoActions.finish, (state, { video }) => ({
    ...state,
    video,
    generating: false,
  })),
  on(generateVideoActions.triggerError, (state, { error }) => ({
    ...state,
    error,
    generating: false,
  })),
  on(generateVideoActions.failure, (state, { error }) => ({
    ...state,
    error,
    generating: false,
  })),

  on(generateVideoActions.progress, (state, { progress }) => ({
    ...state,
    progress,
  })),

  on(generateVideoActions.loadLastVideoSuccess, (state, { video }) => ({
    ...state,
    video: video ?? state.video,
  }))
);

export const generateVideoFeature = createFeature({
  name: generateVideoFeatureKey,
  reducer,
});
