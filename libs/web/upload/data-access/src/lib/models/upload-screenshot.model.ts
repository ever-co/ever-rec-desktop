import { IScreenshot, UploadType } from '@ever-co/shared-utils';
import { UploadItem } from './upload.model';

export class UploadScreenshotItem extends UploadItem {
  constructor(item: IScreenshot) {
    super(item, UploadType.SCREENSHOT);
  }

  public get name(): string {
    return this.loadData()?.metadata?.application?.name || 'Unnamed Photo';
  }

  private loadData(): IScreenshot {
    return this.data as IScreenshot;
  }
}
