import { FindOneOptions } from 'typeorm';
import { IBase } from './base.interface';
import { IScreenshot } from './screenshot.interface';
import { ITimeLog } from './time-log.interface';
import { IVideo } from './video.interface';

// Enhanced interfaces
export type ITimelineFrame = IScreenshot;

export interface ITimelinePosition {
  width: number;
  height: number;
  position: number;
}

export type ITimelineCursor = ITimelinePosition;

export interface ITimelinePlayer {
  currentTime: number;
  isPlaying: boolean;
  duration: number;
  video: IVideo;
}

export interface ITimelineTrack {
  frames: ITimelineFrame[];
  frame: ITimelineFrame | null;
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
  player: ITimelinePlayer;
  track: ITimelineTrack;
  cursor: ITimelineCursor;
}

// Resize event
export interface IResizeEvent {
  width: number;
  height: number;
}

export interface ITimeline extends IBase {
  video?: IVideo;
  videoId?: IVideo['id'];
  timeLog?: ITimeLog;
  timeLogId?: ITimeLog['id'];
}

export interface ITimelineService {
  save(input: Partial<ITimeline>): Promise<ITimeline>;
  findOne(options: FindOneOptions): Promise<ITimeline>;
}
