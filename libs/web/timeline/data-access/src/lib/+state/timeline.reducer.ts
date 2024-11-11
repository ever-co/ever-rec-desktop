import { ITimelineFrame, ITimelineState, IVideo } from '@ever-co/shared-utils';
import { createFeature, createReducer, on } from '@ngrx/store';
import { timelineActions } from './timeline.actions';

export const timelineFeatureKey = 'timeline';

const initialState: ITimelineState = {
  video: {
    currentTime: 0,
    duration: 0,
    isPlaying: false,
    video: {} as IVideo,
  },
  track: {
    frames: [],
    hasNext: false,
    count: 0,
    loading: false,
    page: 1,
    perPage: 20,
    error: '',
    config: {
      frame: {
        width: 48,
        height: 48,
      },
      track: {
        width: 0,
        height: 0,
      },
    },
  },
  cursor: {
    width: 5,
    height: 102,
    position: 0,
  },
};

export const reducer = createReducer(
  initialState,
  on(timelineActions.loadFrames, (state, { page, limit }) => ({
    ...state,
    track: {
      ...state.track,
      loading: true,
      page: page ?? 1,
      perPage: limit ?? 20,
      error: '',
    },
  })),

  on(timelineActions.loadFramesSuccess, (state, { hasNext, data, count }) => ({
    ...state,
    track: {
      ...state.track,
      loading: false,
      frames: mergePaginatedFrames(
        state.track.frames,
        data,
        state.track.page,
        state.track.perPage
      ),
      count,
      hasNext,
      error: '',
    },
  })),

  on(timelineActions.loadFramesFailure, (state, { error }) => ({
    ...state,
    track: {
      ...state.track,
      loading: false,
      error,
    },
  })),

  on(timelineActions.seekTo, (state, { currentTime }) => ({
    ...state,
    video: {
      ...state.video,
      currentTime,
    },
  })),

  on(timelineActions.togglePlayback, (state) => ({
    ...state,
    video: {
      ...state.video,
      isPlaying: !state.video.isPlaying,
    },
  })),

  on(timelineActions.updateCurrentTime, (state, { currentTime }) => ({
    ...state,
    video: {
      ...state.video,
      currentTime,
    },
  })),

  on(timelineActions.resizeTimeline, (state, { width, height }) => ({
    ...state,
    track: {
      ...state.track,
      config: {
        ...state.track.config,
        track: {
          width,
          height,
        },
      },
    },
  }))
);

export const timelineFeature = createFeature({
  name: timelineFeatureKey,
  reducer,
});

// Helper function to merge new frames with existing ones
function mergePaginatedFrames(
  existingFrames: ITimelineFrame[],
  newFrames: ITimelineFrame[],
  pageIndex: number,
  framesPerPage: number
): ITimelineFrame[] {
  const startIndex = pageIndex * framesPerPage;
  const result = [...existingFrames];

  // Extend array if needed
  while (result.length < startIndex + newFrames.length) {
    result.push(null as any);
  }

  // Insert new frames at correct position
  for (let i = 0; i < newFrames.length; i++) {
    result[startIndex + i] = newFrames[i];
  }

  return result;
}
