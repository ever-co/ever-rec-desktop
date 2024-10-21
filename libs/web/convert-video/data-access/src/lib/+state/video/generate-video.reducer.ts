import { IVideo } from '@ever-co/shared-utils';
import { createFeature, createReducer, on } from '@ngrx/store';
import { generateVideoActions } from './generate-video.actions';

export const generateVideoFeatureKey = 'generateVideo';

export interface State {
  progress: number;
  generating: boolean;
  error: string;
  video: IVideo;
  videos: IVideo[];
  hasNext: boolean;
  count: number;
  loading: boolean;
}

export const initialState: State = {
  progress: 0,
  generating: false,
  video: {} as IVideo,
  error: '',
  videos: [],
  hasNext: false,
  count: 0,
  loading: false
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
  })),

  on(generateVideoActions.loadVideos, (state) => ({
    ...state,
    loading: true,
    error: '',
  })),
  on(
    generateVideoActions.loadVideosSuccess,
    (state, { data, hasNext, count }) => ({
      ...state,
      count,
      hasNext,
      videos: [
        ...new Map(
          [...state.videos, ...data].map((item) => [item.id, item])
        ).values(),
      ],
      loading: false,
      error: '',
    })
  ),
  on(generateVideoActions.loadVideosFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);

export const generateVideoFeature = createFeature({
  name: generateVideoFeatureKey,
  reducer,
});
