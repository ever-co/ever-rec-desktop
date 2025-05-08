import { IVideo, UploadType } from '@ever-co/shared-utils';
import { UploadItem } from './upload.model';

export class UploadVideoItem extends UploadItem {
  constructor(item: IVideo) {
    super(item, UploadType.VIDEO);
    this.update();
  }

  private update(): void {
    const data = this.data as IVideo;
    this.name = data?.metadata?.name || 'Unnamed Video';
  }
}
