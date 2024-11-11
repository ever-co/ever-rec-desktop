import { IScreenshot } from './screenshot.interface';
import { IVideo } from './video.interface';

// Enhanced interfaces
export type ITimelineFrame = IScreenshot;

export interface ITimelinePosition {
  width: number;
  height: number;
  position: number;
}

export type ITimelineCursor = ITimelinePosition;

export interface ITimelineVideo {
  currentTime: number;
  isPlaying: boolean;
  duration: number;
  video: IVideo;
}

export interface ITimelineTrack {
  frames: ITimelineFrame[];
  hasNext: boolean;
  count: number;
  loading: boolean;
  page: number;
  perPage: number;
  error: string;
  config: {
    frame: {
      width: number;
      height: number;
    };
    track: {
      width: number;
      height: number;
    };
  };
}

export interface ITimelineState {
  video: ITimelineVideo;
  track: ITimelineTrack;
  cursor: ITimelineCursor;
}

// Resize event
export interface IResizeEvent {
  width: number;
  height: number;
}
