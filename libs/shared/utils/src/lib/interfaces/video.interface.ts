import { FindManyOptions, FindOneOptions } from 'typeorm';
import { IBase } from './base.interface';
import type { IScreenshot } from './screenshot.interface';

export interface IVideo extends IBase {
  pathname: string;
  frameRate?: number;
  resolution?: string;
  duration?: number;
  synced?: boolean;
  parent?: IVideo;
  chunks?: IVideo[];
  screenshots?: IScreenshot[];
}

export interface IVideoInput {
  pathname?: string;
  frameRate?: number;
  resolution?: string;
  duration?: number;
  synced?: boolean;
  parentId?: string;
  chunkIds?: string[];
  screenshotIds?: string[];
}

export interface IVideoService {
  save(input: IVideoInput): Promise<IVideo>;
  findAll(options: FindManyOptions<IVideo>): Promise<IVideo[]>;
  update(id: string, video: Partial<IVideoInput>): Promise<IVideo>;
  findOne(options: FindOneOptions<IVideo>): Promise<IVideo>;
  findOneById(id: string): Promise<IVideo>;
  delete(id: string): Promise<void>;
  deleteAll(videoIds?: string[]): Promise<void>;
}
