import { IScreenshot } from '@ever-capture/shared-utils';
import { Repository } from './repository';

export const screenshotTable = 'screenshot';

export class ScreenshotRepository extends Repository<IScreenshot> {
  constructor() {
    super(screenshotTable);
  }
}
