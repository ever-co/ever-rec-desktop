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
