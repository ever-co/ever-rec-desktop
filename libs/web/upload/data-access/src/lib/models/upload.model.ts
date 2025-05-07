import {
  IAudio,
  IPhoto,
  IScreenshot,
  IUpload,
  IVideo,
  UploadType,
} from '@ever-co/shared-utils';

export type Uploadable = IVideo | IPhoto | IAudio | IScreenshot;

export interface IUploadItem {
  id: string;
  type: UploadType;
  name: string;
  size: number;
  progress: number;
  data: Uploadable;
  error: string | null;
}

export abstract class UploadItem implements IUploadItem {
  public readonly id: string;
  public readonly type: UploadType;
  public readonly data: Uploadable;
  public progress: number;
  public error: string | null;
  public abstract get name(): string;

  constructor(item: Uploadable, type: UploadType) {
    this.id = item.id;
    this.type = type;
    this.progress = 0;
    this.data = item;
    this.error = null;
  }

  public get size(): number {
    return this.data.metadata?.size || 0;
  }
}

export class UploadMapper {
  public static toUpload(data: IUploadItem): IUpload {
    return {
      type: data.type,
      key: 'file',
      ids: [data.id],
    };
  }
}
