import { FindManyOptions, FindOneOptions } from 'typeorm';
import { IBase } from './base.interface';
import { ITimeLog } from './time-log.interface';

export interface IPhoto extends IBase {
  pathname: string;
  synced?: boolean;
  timeLog?: ITimeLog;
  timeLogId?: ITimeLog['id'];
  metadata?: IPhotoMetadata;
}

export interface ICameraPersistance {
  isAuthorized?: boolean;
  deviceId?: string;
  tracking?: boolean;
  microphoneId?: string;
  resolution?: Resolution;
}

export enum Resolution {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export interface IConstraintStream {
  deviceId?: string;
  stream?: MediaStream | null;
  resolution?: Resolution;
}

export interface IPhotoMetadata extends IBase {
  name?: string;
  resolution?: Resolution;
  size: number;
  photo?: IPhoto;
  photoId?: IPhoto['id'];
}

export interface IPhotoSave {
  dataURL: string;
  resolution: Resolution;
}

export type IPhotoInput = Omit<IPhoto, 'timeLog' | 'id'>;

export type IPhotoMetadataInput = Omit<IPhotoMetadata, 'photo' | 'id'>;

export interface IPhotoService {
  save(input: IPhotoInput): Promise<IPhoto>;
  update(id: string, photo: Partial<IPhotoInput>): Promise<IPhoto>;
  findAll(options: FindManyOptions<IPhoto>): Promise<IPhoto[]>;
  findOne(options: FindOneOptions<IPhoto>): Promise<IPhoto>;
  findAndCount(options: FindOneOptions<IPhoto>): Promise<[IPhoto[], number]>;
  findOneById(id: string): Promise<IPhoto>;
  delete(id: string): Promise<void>;
  deleteAll(videoIds?: string[]): Promise<void>;
}

export interface IPhotoMetadataService {
  save(input: IPhotoMetadataInput): Promise<IPhotoMetadata>;
  update(
    id: string,
    photo: Partial<IPhotoMetadataInput>
  ): Promise<IPhotoMetadata>;
}

export type IPhotoCreateInput = Omit<IPhotoInput, 'metadata'> & {
  metadata?: Omit<IPhotoMetadataInput, 'id'>;
};

export const PHOTO_DIR = 'photos';
