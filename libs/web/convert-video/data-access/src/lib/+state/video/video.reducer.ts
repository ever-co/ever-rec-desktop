import { IVideo } from '@ever-co/shared-utils';
import { createFeature, createReducer, on } from '@ngrx/store';
import { videoActions } from './video.actions';

export const videoFeatureKey = 'video';

export interface IVideoState {
  error: string;
  video: IVideo;
  videos: IVideo[];
  hasNext: boolean;
  count: number;
  loading: boolean;
  deleting: boolean;
}

export const initialState: IVideoState = {
  video: {} as IVideo,
  videos: [],
  error: '',
  count: 0,
  hasNext: false,
  loading: false,
  deleting: false
};

export const reducer = createReducer(
  initialState,
  // Load Videos
  on(videoActions.loadVideos, (state) => ({
    ...state,
    loading: true,
    error: '',
  })),
  on(videoActions.loadVideosSuccess, (state, { data, hasNext, count }) => ({
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
  })),
  on(videoActions.loadVideosFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Load Video
  on(videoActions.loadVideo, (state) => ({
    ...state,
    loading: true,
    error: '',
  })),
  on(videoActions.loadVideoSuccess, (state, { video }) => ({
    ...state,
    video,
    loading: false,
    error: '',
  })),
  on(videoActions.loadVideosFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete Video Actions Reducers
  on(videoActions.deleteVideo, (state) => ({
    ...state,
    deleting: true,
  })),

  on(videoActions.deleteVideos, (state) => ({
    ...state,
    deleting: true,
  })),

  on(videoActions.deleteVideoSuccess, (state, { id }) => ({
    ...state,
    video: state.video?.id === id ? initialState.video : state.video,
    videos: state.videos.filter((video) => video.id !== id),
    deleting: false,
  })),

  on(videoActions.deleteVideosSuccess, (state, { videos }) => {
    const videoIdsDeleted = videos.map((video) => video.id);

    // Determine the current video state
    const updatedVideo = state.video?.id && videoIdsDeleted.includes(state.video.id)
      ? state.video
      : initialState.video;

    // Filter out deleted videos
    const updatedVideos = state.videos.filter(
      (video) => !videoIdsDeleted.includes(video.id)
    );

    return {
      ...state,
      video: updatedVideo,
      videos: updatedVideos,
      deleting: false,
    };
  }),

  on(videoActions.deleteVideoFailure, (state, { error }) => ({
    ...state,
    deleting: false,
    error,
  })),

  // Update Video
  on(videoActions.updateVideo, (state) => ({
    ...state,
    loading: true,
  })),

  on(videoActions.updateVideoSuccess, (state, video) => ({
    ...state,
    video,
    videos: state.videos.map((v) => (video.id === video.id ? video : v)),
  })),

  on(videoActions.deleteVideoFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Reset videos
  on(videoActions.resetVideos, (state) => ({
    ...state,
    videos: initialState.videos,
  }))
);

export const videoFeature = createFeature({
  name: videoFeatureKey,
  reducer,
});
