import { IScreenshot, UploadType } from '@ever-co/shared-utils';
import { UploadItem } from './upload.model';

export class UploadScreenshotItem extends UploadItem {
  constructor(item: IScreenshot) {
    super(item, UploadType.SCREENSHOT);
    this.update();
  }

  private update(): void {
    const data = this.data as IScreenshot;
    this.name = data?.metadata?.application?.name || 'Unnamed Screenshot';
  }
}
