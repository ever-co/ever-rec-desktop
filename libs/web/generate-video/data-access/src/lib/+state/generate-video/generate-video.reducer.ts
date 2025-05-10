import { IVideo } from '@ever-co/shared-utils';
import { createFeature, createReducer, on } from '@ngrx/store';
import { generateVideoActions } from './generate-video.actions';

export const generateVideoFeatureKey = 'generateVideo';

export interface GenerateVideoState {
  progress: number;
  generating: boolean;
  error: string;
  video: IVideo;
  loading: boolean;
}

export const initialGenerateState: GenerateVideoState = {
  progress: 0,
  generating: false,
  video: {} as IVideo,
  error: '',
  loading: false,
};

export const reducer = createReducer(
  initialGenerateState,
  on(generateVideoActions.start, (state) => ({
    ...state,
    error: '',
    generating: true,
  })),
  on(generateVideoActions.cancelSuccess, (state) => ({
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
  })),

  on(generateVideoActions.resetSuccess, () => initialGenerateState),
);

export const generateVideoFeature = createFeature({
  name: generateVideoFeatureKey,
  reducer,
});
