import { IUsedSize } from '@ever-co/shared-utils';
import { ScreenshotMetadataRepository } from '../repositories/screenshot-metadata.repository';
import { VideoMetadataRepository } from '../repositories/video-metadata.repository';
import { PhotoMetadataRepository } from '../repositories/photo-metadata.repository';
import { IsNull, Not } from 'typeorm';
import { AudioMetadataRepository } from '../repositories/audio-metadata.repository';

export class MetadataService {
  private readonly screenshotMetadataRepository =
    ScreenshotMetadataRepository.instance;
  private readonly videoMetadataRepository = VideoMetadataRepository.instance;
  private readonly photoMetadataRepository = PhotoMetadataRepository.instance;
  private readonly audioMetadataRepository = AudioMetadataRepository.instance;
  public async getUsedSize(options = {}): Promise<IUsedSize> {
    // Execute both sum queries concurrently for performance
    const [
      screenshotTotalSize,
      videoTotalSize,
      photoTotalSize,
      audioTotalSize,
    ] = await Promise.all([
      this.screenshotMetadataRepository.sum('size', {
        screenshot: {
          id: Not(IsNull()),
        },
        ...options,
      }),
      this.videoMetadataRepository.sum('size', options),
      this.photoMetadataRepository.sum('size', options),
      this.audioMetadataRepository.sum('size', options),
    ]);

    const screenshot = screenshotTotalSize || 0;
    const video = videoTotalSize || 0;
    const photo = photoTotalSize || 0;
    const audio = audioTotalSize || 0;
    const total = screenshot + video + photo;

    // Ensure both sums default to 0 if they are falsy (like null or undefined)
    return {
      total,
      screenshot,
      video,
      photo,
      audio,
    };
  }
}
