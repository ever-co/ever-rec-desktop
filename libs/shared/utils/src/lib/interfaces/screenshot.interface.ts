import { IBase } from './base.interface';
import type { IVideo } from './video.interface';

export interface IScreenshot extends IBase {
  pathname: string;
  synced?: boolean;
  metadata?: IScreenshotMetadata;
  video?: IVideo,
  videoId?: string
}

export interface IScreenshotMetadata extends IBase {
  icon?: string;
  name?: string;
  description?: string;
  screenshot?: IScreenshot;
}

export type IScreenshotInput =
  | Omit<IScreenshot, 'id' | 'metadata'> & {
      metadata: Omit<IScreenshotMetadata, 'id'>;
    };

export type IScreenshotTimeLine = IScreenshot & { duration: number };
