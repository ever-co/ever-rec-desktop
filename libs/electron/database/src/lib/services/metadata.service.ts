import { ScreenshotMetadataRepository } from '../repositories/screenshot-metadata.repository';
import { VideoMetadataRepository } from '../repositories/video-metadata.repository';

export class MetadataService {
  private readonly screenshotMetadataRepository =
    ScreenshotMetadataRepository.instance;
  private readonly videoMetadataRepository = VideoMetadataRepository.instance;

  public async getTotalSize(): Promise<number> {
    // Execute both sum queries concurrently for performance
    const [screenshotTotalSize, videoTotalSize] = await Promise.all([
      this.screenshotMetadataRepository.sum('size', {}),
      this.videoMetadataRepository.sum('size', {}),
    ]);

    // Ensure both sums default to 0 if they are falsy (like null or undefined)
    return (screenshotTotalSize || 0) + (videoTotalSize || 0);
  }
}
