import { IAudio, UploadType } from '@ever-co/shared-utils';
import { UploadItem } from './upload.model';

export class UploadAudioItem extends UploadItem {
  constructor(item: IAudio) {
    super(item, UploadType.AUDIO);
  }

  public get name(): string {
    return this.loadData()?.metadata?.name || 'Unnamed Audio';
  }

  private loadData(): IAudio {
    return this.data as IAudio;
  }
}
