import { IFindOneOptions } from './base.interface';
import { IS3Config } from './storage.interface';

export enum UploadType {
  VIDEO = 'videos',
  SCREENSHOT = 'screenshots',
  PHOTO = 'photos',
  AUDIO = 'audios',
}

export interface IUploadFile {
  pathname: string;
  key: string;
}

export interface IUpload {
  type: UploadType;
  key: string;
  ids: string[];
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
  result: {
    fullUrl: string;
    id: string;
  };
}

export interface IUploadableService<T = any> {
  findAll(options: IFindOneOptions<T>): Promise<T[]>;
  update(id: string, data: Partial<T>): Promise<T>;
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
