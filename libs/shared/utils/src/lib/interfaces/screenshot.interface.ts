import { IBase } from './base.interface';

export interface IScreenshot extends IBase {
  pathname: string;
  synced?: boolean;
  metadata?: IScreenshotMetadata;
}

export interface IScreenshotMetadata extends IBase {
  icon?: string;
  name?: string;
  description?: string;
}

export type IScreenshotInput =
  | Omit<IScreenshot, 'id' | 'metadata'> & {
      metadata: Omit<IScreenshotMetadata, 'id'>;
    };

export type IScreenshotTimeLine = IScreenshot & { duration: number };
