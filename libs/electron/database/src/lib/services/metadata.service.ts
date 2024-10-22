import { IUsedSize } from '@ever-co/shared-utils';
import { ScreenshotMetadataRepository } from '../repositories/screenshot-metadata.repository';
import { VideoMetadataRepository } from '../repositories/video-metadata.repository';

export class MetadataService {
  private readonly screenshotMetadataRepository =
    ScreenshotMetadataRepository.instance;
  private readonly videoMetadataRepository = VideoMetadataRepository.instance;

  public async getUsedSize(): Promise<IUsedSize> {
    // Execute both sum queries concurrently for performance
    const [screenshotTotalSize, videoTotalSize] = await Promise.all([
      this.screenshotMetadataRepository.sum('size', {}),
      this.videoMetadataRepository.sum('size', {}),
    ]);

    const screenshot = (screenshotTotalSize || 0);
    const video = (videoTotalSize || 0);
    const total = screenshot + video;

    // Ensure both sums default to 0 if they are falsy (like null or undefined)
    return {
      total,
      screenshot,
      video
    };
  }
}
