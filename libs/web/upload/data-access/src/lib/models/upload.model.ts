import {
  Clonable,
  IAudio,
  IPhoto,
  IScreenshot,
  IUpload,
  IVideo,
  UploadType,
} from '@ever-co/shared-utils';

export type Uploadable = IVideo | IPhoto | IAudio | IScreenshot;

export interface IUploadItem extends Clonable<IUploadItem> {
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
  public name: string;
  public size: number;

  constructor(item: Uploadable, type: UploadType) {
    this.id = item.id;
    this.type = type;
    this.progress = 0;
    this.data = item;
    this.error = null;
    this.name = '';
    this.size = this.data.metadata?.size || 0;
  }

  public clone(): IUploadItem {
    const cloned = Object.create(this.constructor.prototype) as IUploadItem;

    Object.assign(cloned, {
      id: this.id,
      type: this.type,
      data: structuredClone(this.data),
      progress: this.progress,
      error: this.error,
      name: this.name,
      size: this.size,
    });

    return cloned;
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
