import type {
  IScreenshot,
  IScreenshotMetadata,
} from '@ever-capture/shared-utils';
import { Base } from './base.entity';

export class ScreenshotMetadata extends Base implements IScreenshotMetadata {
  public name: string;
  public icon: string;
  public description: string;
  public screenshot?: IScreenshot;

  constructor(partial: Partial<IScreenshotMetadata> = {}) {
    super();
    this.name = partial.name || '';
    this.icon = partial.icon || '';
    this.description = partial.description || '';
  }
}
