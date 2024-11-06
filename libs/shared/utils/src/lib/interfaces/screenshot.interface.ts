import { IBase } from './base.interface';
import { ITimeLog } from './time-log.interface';
import type { IVideo } from './video.interface';

export interface IScreenshot extends IBase {
  pathname: string;
  synced?: boolean;
  metadata?: IScreenshotMetadata;
  video?: IVideo;
  timeLog?: ITimeLog;
}

export interface IScreenshotMetadata extends IBase {
  icon?: string;
  name?: string;
  description?: string;
  size?: number;
}

export interface IScreenshotChartLine {
  count: number;
  timeSlot: string;
}

export type TimeSlot = 'minute' | 'tenMinutes' | 'hour';

export type IScreenshotInput =
  | Omit<IScreenshot, 'id' | 'metadata'> & {
      metadata: Omit<IScreenshotMetadata, 'id'>;
    };

export type IScreenshotTimeLine = IScreenshot & { duration: number };
