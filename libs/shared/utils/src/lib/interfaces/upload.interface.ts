import { IBase, IFindOneOptions } from './base.interface';
import { IS3Config } from './storage.interface';
import type { IAudio } from './audio.interface';
import type { IScreenshot } from './screenshot.interface';
import type { IVideo } from './video.interface';
import type { IPhoto } from './webcam.interface';

export enum UploadType {
  VIDEO = 'videos',
  SCREENSHOT = 'screenshots',
  PHOTO = 'camshots',
  AUDIO = 'soundshots',
}

export interface IUploadFile {
  pathname: string;
  key: string;
}

export interface IUpload {
  type: UploadType;
  key: string;
  ids: string[];
  refreshToken?: string;
  token?: string;
  apiUrl?: string;
}

export interface IUploadProgress {
  itemId: string;
  progress: number;
}

export interface IUploadError {
  error: string;
  itemId: string;
}

export interface IUploadDone {
  itemId: string;
  result: IRemoteUpload;
}

export interface IUploadableService<T = any, U = any> {
  findAll(options: IFindOneOptions<T>): Promise<T[]>;
  update(id: string, data: Partial<T>): Promise<T>;
  saveUpload<TUpload extends U>(upload: TUpload): Promise<IUploadBase>;
}

export interface IUploaderService {
  execute(
    event: Electron.IpcMainEvent,
    upload: IUpload,
    s3Config: IS3Config,
  ): Promise<void>;
}

// Interface for upload event handler to follow Interface Segregation
export interface IUploadEventHandler {
  register(): void;
  unregister(): void;
}

// Interface for factory to follow Dependency Inversion
export interface IUploaderServiceFactory {
  create(upload: IUpload): IUploaderService;
}

export interface IUploadBase extends IBase {
  remoteUrl?: string;
  remoteId?: string;
  uploadedAt?: string;
}

export interface IRemoteUpload {
  fullUrl: string;
  id: string;
  recordedAt: string;
}

export interface IVideoUpload extends IUploadBase {
  videoId?: string;
  video?: IVideo;
}

export interface IScreenshotUpload extends IUploadBase {
  screenshotId?: string;
  screenshot?: IScreenshot;
}

export interface IAudioUpload extends IUploadBase {
  audioId?: string;
  audio?: IAudio;
}

export interface IPhotoUpload extends IUploadBase {
  photoId?: string;
  photo?: IPhoto;
}

export interface IUploadable {
  uploads?: IUploadBase[];
}
