import { FindManyOptions, FindOneOptions } from 'typeorm';
import { IBase } from './base.interface';
import type { IScreenshot } from './screenshot.interface';
import { ITimeLog } from './time-log.interface';
import type { ITimeline } from './timeline.interface';
import type { IVideoConfig } from './video.config';

export interface IVideo extends IBase {
  pathname: string;
  synced?: boolean;
  parent?: IVideo;
  chunks?: IVideo[];
  screenshots?: IScreenshot[];
  metadata?: IVideoMetadata;
  timeLog?: ITimeLog;
  timelines?: ITimeline[];
  isTimeline?: boolean;
}

export interface IVideoMetadata extends IBase, Partial<IVideoConfig> {
  name?: string;
  video?: IVideo;
  summary?: string;
}

export interface IVideoInput extends Partial<IVideoConfig> {
  pathname?: string;
  synced?: boolean;
  parentId?: string;
  chunkIds?: string[];
  screenshotIds?: string[];
  metadataId?: string;
  timeLogId?: string;
}

export type IVideoMetadataInput = Partial<IVideoMetadata> & {
  videoId?: string;
};

export interface IVideoService {
  save(input: IVideoInput): Promise<IVideo>;
  findAll(options: FindManyOptions<IVideo>): Promise<IVideo[]>;
  update(id: string, video: Partial<IVideoInput>): Promise<IVideo>;
  findOne(options: FindOneOptions<IVideo>): Promise<IVideo>;
  findAndCount(options: FindOneOptions<IVideo>): Promise<[IVideo[], number]>;
  findOneById(id: string): Promise<IVideo>;
  delete(id: string): Promise<void>;
  deleteAll(videoIds?: string[]): Promise<void>;
}

export interface IBatchVideo {
  path: IVideo['pathname'];
  index: number;
}
