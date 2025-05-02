import { FindManyOptions, FindOneOptions } from 'typeorm';
import type { IApplication } from './application.interface';
import { IBase } from './base.interface';
import { ITimeLog } from './time-log.interface';
import type { IVideo } from './video.interface';

export const SCREENSHOT_DIR = 'screenshots';

export interface IScreenshot extends IBase {
  pathname: string;
  synced?: boolean;
  metadata?: IScreenshotMetadata;
  parent?: IScreenshot;
  chunks?: IScreenshot[];
  video?: IVideo;
  timeLog?: ITimeLog;
}

export interface IScreenshotMetadata extends IBase {
  description?: string;
  size?: number;
  application?: IApplication;
  screenshot?: IScreenshot;
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

export interface IGetScreenshotQueryResult {
  name: string;
  description: string;
  icon: string;
}

export interface IScreenshotService {
  save(input: IScreenshotInput): Promise<IScreenshot>;
  findAll(options: FindManyOptions<IScreenshot>): Promise<IScreenshot[]>;
  update(id: string, video: Partial<IScreenshotInput>): Promise<IScreenshot>;
  findOne(options: FindOneOptions<IScreenshot>): Promise<IScreenshot>;
  findAndCount(
    options: FindOneOptions<IScreenshot>
  ): Promise<[IScreenshot[], number]>;
  findOneById(id: string): Promise<IScreenshot>;
  delete(id: string): Promise<void>;
  deleteAll(videoIds?: string[]): Promise<void>;
  groupScreenshotsByHour(): Promise<IScreenshotChartLine[]>;
  groupScreenshotsByTenMinutes(): Promise<IScreenshotChartLine[]>;
  groupScreenshotsByMinute(): Promise<IScreenshotChartLine[]>;
}
