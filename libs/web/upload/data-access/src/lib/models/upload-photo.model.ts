import { IPhoto, UploadType } from '@ever-co/shared-utils';
import { UploadItem } from './upload.model';

export class UploadPhotoItem extends UploadItem {
  constructor(item: IPhoto) {
    super(item, UploadType.PHOTO);
  }

  public get name(): string {
    return this.loadData()?.metadata?.name || 'Unnamed Photo';
  }

  private loadData(): IPhoto {
    return this.data as IPhoto;
  }
}
