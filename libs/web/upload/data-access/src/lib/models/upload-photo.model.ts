import { IPhoto, UploadType } from '@ever-co/shared-utils';
import { UploadItem } from './upload.model';

export class UploadPhotoItem extends UploadItem {
  constructor(item: IPhoto) {
    super(item, UploadType.PHOTO);
    this.update();
  }

  private update(): void {
    const data = this.data as IPhoto;
    this.name = data?.metadata?.name || 'Unnamed Photo';
  }
}
