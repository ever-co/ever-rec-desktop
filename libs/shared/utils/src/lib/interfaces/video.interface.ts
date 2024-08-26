import { IBase } from './base.interface';
import type { IScreenshot } from './screenshot.interface';
import { IVideoConfig } from './video.config';

export interface IVideo extends IBase {
  pathname: string;
  synced?: boolean;
  parent?: IVideo;
  chunks?: IVideo[];
  screenshots?: IScreenshot[];
  metadata?: IVideoMetadata;
  parentId?: string;
}

export interface IVideoMetadata extends IBase, Partial<IVideoConfig> {
  video?: IVideo;
}

export interface IVideoInput extends Partial<IVideoConfig> {
  pathname?: string;
  synced?: boolean;
  parentId?: string;
  chunkIds?: string[];
  screenshotIds?: string[];
  metadataId?: string;
}

export type IVideoMetadataInput = Partial<IVideoConfig> & {
  videoId?: string;
};

export interface IFetchVideoInput {
  screenshotIds: string[];
  videoMetadata: Partial<IVideoMetadata>;
}

export interface IFetchVideoOutput extends IVideo {
  count: number;
}

export interface IVideoService {
  save(input: IVideoInput): Promise<IVideo>;
  findAll<T>(options: T): Promise<IVideo[]>;
  update(id: string, video: Partial<IVideoInput>): Promise<IVideo>;
  findOne<T>(options: T): Promise<IVideo>;
  findOneById(id: string): Promise<IVideo>;
  delete(id: string): Promise<void>;
  deleteAll(videoIds?: string[]): Promise<void>;
  getFinalVideo(input: IFetchVideoInput): Promise<IFetchVideoOutput>;
}
