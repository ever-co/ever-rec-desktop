import { IScreenshotMetadata } from '@ever-capture/shared-utils';
import { Repository } from './repository';

export const screenshotMetadataTable = 'screenshot_metadata';

export class ScreenshotMetadataRepository extends Repository<IScreenshotMetadata> {
  constructor() {
    super(screenshotMetadataTable);
  }
}
