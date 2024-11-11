import { ITimelineFrame, ITimelineState, IVideo } from '@ever-co/shared-utils';
import { createFeature, createReducer, on } from '@ngrx/store';
import { timelineActions } from './timeline.actions';

export const timelineFeatureKey = 'timeline';

const initialState: ITimelineState = {
  player: {
    currentTime: 0,
    duration: 0,
    isPlaying: false,
    video: {} as IVideo,
  },
  track: {
    frames: [],
    frame: null,
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
    player: {
      ...state.player,
      currentTime,
    },
    cursor: {
      ...state.cursor,
      position: (currentTime / state.player.duration) * 100,
    },
  })),

  on(timelineActions.togglePlayback, (state, { isPlaying }) => ({
    ...state,
    player: {
      ...state.player,
      isPlaying,
    },
  })),

  on(timelineActions.updateCurrentTime, (state, { currentTime }) => ({
    ...state,
    player: {
      ...state.player,
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
  })),

  on(timelineActions.selectFrame, (state, { frame }) => ({
    ...state,
    track: {
      ...state.track,
      frame,
    },
    // cursor: {
    //   ...state.cursor,
    // position: frame
    //   ? (state.track.frames.indexOf(frame) / state.track.count) * 100
    //   : state.cursor.position,
    // },
  })),

  on(timelineActions.loadLastVideo, (state, { video }) => ({
    ...state,
    player: {
      ...state.player,
      video: video ?? ({} as IVideo),
      duration: video?.metadata?.duration ?? 0,
    },
  })),

  on(timelineActions.cursorPosition, (state, { position }) => ({
    ...state,
    player: {
      ...state.player,
      currentTime: state.player.isPlaying
        ? state.player.currentTime
        : (position / 100) * state.player.duration,
    },
    cursor: {
      ...state.cursor,
      position: state.player.isPlaying ? state.cursor.position : position,
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
  const result = [
    ...new Map(
      [...existingFrames, ...newFrames].map((item) => [item.id, item])
    ).values(),
  ];

  return result;
}
