import { IBase, IFindOneOptions, IFindManyOptions } from './base.interface';
import { ITimeLog } from './time-log.interface';

export interface IAudioMetadata extends IBase {
  size?: number;
  name?: string;
  duration?: number;
  rate?: number;
  channels?: number;
  audio?: IAudio;
  audioId?: IAudio['id'];
}

export interface IAudio extends IBase {
  pathname: string;
  synced?: boolean;
  timeLog?: ITimeLog;
  timeLogId?: ITimeLog['id'];
  metadata?: IAudioMetadata;
}

export type IAudioInput = Omit<IAudio, 'timeLog' | 'id'>;

export type IAudioMetadataInput = Omit<IAudioMetadata, 'photo' | 'id'>;

export interface IAudioSave {
  blob: Blob;
}

export interface IAudioService {
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
