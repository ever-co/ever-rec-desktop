import { IBase, IFindOneOptions, IFindManyOptions } from './base.interface';
import { ITimeLog } from './time-log.interface';
import { IUploadable, IUploadableService } from './upload.interface';
import { IVideo } from './video.interface';

export interface IAudioMetadata extends IBase {
  size?: number;
  name?: string;
  duration?: number;
  rate?: number;
  channels?: number;
  audio?: IAudio;
  audioId?: IAudio['id'];
}

export interface IAudio extends IBase, IUploadable {
  pathname: string;
  synced?: boolean;
  parent?: IAudio;
  chunks?: IAudio[];
  timeLog?: ITimeLog;
  timeLogId?: ITimeLog['id'];
  metadata?: IAudioMetadata;
  video?: IVideo;
  videoId?: IVideo['id'];
}

export type IAudioInput = Omit<IAudio, 'timeLog' | 'id'>;

export type IAudioMetadataInput = Omit<
  IAudioMetadata,
  'audio' | 'video' | 'id'
>;

export interface IAudioSave
  extends Pick<IAudioMetadata, 'rate' | 'channels' | 'duration'> {
  arrayBuffer: ArrayBuffer;
  videoId?: IVideo['id'];
}

export interface IAudioService extends IUploadableService {
  save(input: IAudioInput): Promise<IAudio>;
  update(id: string, audio: Partial<IAudioInput>): Promise<IAudio>;
  findAll(options: IFindManyOptions<IAudio>): Promise<IAudio[]>;
  findOne(options: IFindOneOptions<IAudio>): Promise<IAudio>;
  findAndCount(options: IFindOneOptions<IAudio>): Promise<[IAudio[], number]>;
  findOneById(id: string): Promise<IAudio>;
  delete(id: string): Promise<void>;
  deleteAll(audioIds?: string[]): Promise<void>;
}

export interface IAudioMetadataService {
  save(input: IAudioMetadataInput): Promise<IAudioMetadata>;
  update(
    id: string,
    photo: Partial<IAudioMetadataInput>
  ): Promise<IAudioMetadata>;
}

export type IAudioCreateInput = Omit<IAudioInput, 'metadata'> & {
  metadata?: Omit<IAudioMetadataInput, 'id'>;
};

export const AUDIO_DIR = 'audio';
