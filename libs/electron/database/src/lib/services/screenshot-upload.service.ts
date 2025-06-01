import { IScreenshotUpload } from '@ever-co/shared-utils';
import { ScreenshotUploadRepository } from '../repositories/screenshot-upload.repository';
import { ScreenshotUpload } from '../entities/screenshot-upload.entity';

export class ScreenshotUploadService {
  private readonly repository = ScreenshotUploadRepository.instance;

  public async save(input: Partial<IScreenshotUpload>): Promise<IScreenshotUpload> {
    const upload = new ScreenshotUpload();
    upload.remoteUrl = input.remoteUrl;
    upload.remoteId = input.remoteId;
    upload.uploadedAt = input.uploadedAt;
    upload.screenshotId = input.screenshotId;
    return this.repository.save(upload);
  }
}
