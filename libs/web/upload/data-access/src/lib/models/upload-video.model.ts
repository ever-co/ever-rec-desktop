import { IVideo, UploadType } from '@ever-co/shared-utils';
import { UploadItem } from './upload.model';

export class UploadVideoItem extends UploadItem {
  constructor(item: IVideo) {
    super(item, UploadType.VIDEO);
  }

  public get name(): string {
    return this.loadData()?.metadata?.name || 'Unnamed Video';
  }

  private loadData(): IVideo {
    return this.data as IVideo;
  }
}
