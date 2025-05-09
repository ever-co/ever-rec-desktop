import { IAudio, UploadType } from '@ever-co/shared-utils';
import { UploadItem } from './upload.model';

export class UploadAudioItem extends UploadItem {
  constructor(item: IAudio) {
    super(item, UploadType.AUDIO);
    this.update();
  }

  private update() {
    const data = this.data as IAudio;
    this.name = data?.metadata?.name || 'Unnamed Audio';
  }
}
