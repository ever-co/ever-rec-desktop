import { IVideo, IVideoInput, IVideoService } from '@ever-capture/shared-utils';
import { videoMetadataTable } from '../repositories/video-metadata.repository';
import { VideoRepository } from '../repositories/video.repository';
import { ScreenshotService } from './screenshot.service';
import { VideoMetadataService } from './video-metadata.service';

export class VideoService implements IVideoService {
  private readonly repository = new VideoRepository();
  private readonly screenshotService = ScreenshotService;
  private readonly metadataService = new VideoMetadataService();

  public async save(input: IVideoInput): Promise<IVideo> {
    if (!input) {
      throw new Error('Invalid input');
    }

    try {
      const videoMetadata = await this.metadataService.save(input);

      // Save and return the video entity
      const video = await this.repository.save({
        pathname: input.pathname,
        parentId: input.parentId,
        [`${videoMetadataTable}Id`]: videoMetadata.id,
      });

      // Handle chunk associations
      if (input.chunkIds) {
        for (const chunkId of input.chunkIds) {
          await this.update(chunkId, { parentId: video.id });
        }
      }

      // Handle screenshot associations
      if (input.screenshotIds) {
        for (const screenshotId of input.screenshotIds) {
          await this.screenshotService.update(screenshotId, {
            videoId: video.id,
          });
        }
      }

      return video;
    } catch (error) {
      console.error('Error saving video:', error);
      throw new Error('Error saving video');
    }
  }

  public async findAll(options): Promise<IVideo[]> {
    return this.repository.findAll(options);
  }

  public async update(
    id: string,
    input: Partial<IVideoInput>
  ): Promise<IVideo> {
    // Fetch the existing video entity to update
    const existingVideo = await this.repository.findOneById(id);

    if (!existingVideo) {
      throw new Error(`Video with ID ${id} not found`);
    }

    // Update relationships
    if (input.parentId) {
      existingVideo.parent = await this.repository.update(id, {
        parentId: input.parentId,
      });
    }
    // Handle chunk associations
    if (input.chunkIds) {
      for (const chunkId of input.chunkIds) {
        await this.repository.update(chunkId, { parentId: id });
      }
    }

    // Handle screenshot associations
    if (input.screenshotIds) {
      for (const screenshotId of input.screenshotIds) {
        await this.screenshotService.update(screenshotId, {
          videoId: id,
        });
      }
    }

    // Return the updated video entity
    return this.findOneById(id);
  }

  public async findOne(options): Promise<IVideo> {
    return this.repository.findOne(options);
  }

  public async findOneById(id: string): Promise<IVideo> {
    return this.repository.findOneById(id);
  }

  public async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  public async deleteAll(videoIds?: string[]): Promise<void> {
    await this.repository.deleteAll(videoIds);
  }
}
