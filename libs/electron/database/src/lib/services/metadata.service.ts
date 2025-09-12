import { IUsedSize } from '@ever-co/shared-utils';
import { IsNull, Not } from 'typeorm';
import { AudioMetadataRepository } from '../repositories/audio-metadata.repository';
import { PhotoMetadataRepository } from '../repositories/photo-metadata.repository';
import { ScreenshotMetadataRepository } from '../repositories/screenshot-metadata.repository';
import { VideoMetadataRepository } from '../repositories/video-metadata.repository';
import { UserSessionService } from './user-session.service';

export class MetadataService {
  private readonly screenshotMetadataRepository =
    ScreenshotMetadataRepository.instance;
  private readonly videoMetadataRepository = VideoMetadataRepository.instance;
  private readonly photoMetadataRepository = PhotoMetadataRepository.instance;
  private readonly audioMetadataRepository = AudioMetadataRepository.instance;
  private readonly userSessionService = new UserSessionService();

  public async getUsedSize(options = {}): Promise<IUsedSize> {
    const user = await this.userSessionService.currentUser();
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
          timeLog: {
            session: {
              user: {
                id: user.id
              }
            }
          }
        },
        ...options
      }),
      this.videoMetadataRepository.sum('size', this.buildQueryOptions('video', user.id, options)),
      this.photoMetadataRepository.sum('size', this.buildQueryOptions('photo', user.id, options)),
      this.audioMetadataRepository.sum('size', this.buildQueryOptions('audio', user.id, options)),
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

  private buildQueryOptions(parent: string, userId: string, options = {}) {
    return {
      ...options,
      [parent]: {
        ...options[parent],
        timeLog: {
          session: {
            user: {
              id: userId
            }
          }
        }
      }
    }
  }
}
