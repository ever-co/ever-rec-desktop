import type {
  IScreenshot,
  IScreenshotMetadata,
  IVideo,
} from '@ever-capture/shared-utils';
import { Base } from './base.entity';

export class Screenshot extends Base implements IScreenshot {
  public pathname: string;
  public synced: boolean;
  public metadata: IScreenshotMetadata;
  public video?: IVideo;

  constructor(partial: IScreenshot) {
    super();
    this.pathname = partial.pathname;
    this.synced = partial.synced;
  }
}
