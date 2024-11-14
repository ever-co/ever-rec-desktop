import { IScreenshotService } from './screenshot.interface';
import { IVideoService } from './video.interface';

export enum UploadType {
  VIDEO = 'video',
  SCREENSHOT = 'screenshot',
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

export type IUploadableService = IVideoService | IScreenshotService;
