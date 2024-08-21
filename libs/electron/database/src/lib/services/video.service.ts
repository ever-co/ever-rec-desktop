import { IVideo, IVideoInput, IVideoService } from '@ever-capture/shared-utils';
import { Video } from '../entities/video.entity';
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

    // Create a new Video instance and assign properties from input
    const video = Object.assign(new Video(), { pathname: input.pathname });

    try {
      // Handle parent video association
      if (input.parentId) {
        video.parentId = input.parentId
      }

      // Handle chunk associations
      if (input.chunkIds) {
        const chunks = await this.repository.findAll({
          whereIn: {
            column: 'id',
            values: input.chunkIds,
          },
        });
        if (chunks.length !== input.chunkIds.length) {
          throw new Error('Some chunks were not found');
        }
        video.chunks = chunks;
      }

      // Handle screenshot associations
      if (input.screenshotIds) {
        const screenshots = await this.screenshotService.findAll({
          whereIn: { column: 'id', values: input.screenshotIds },
        });
        if (screenshots.length !== input.screenshotIds.length) {
          throw new Error('Some screenshots were not found');
        }
        video.screenshots = screenshots;
      }

      const videoMetadataId = await this.metadataService.save(input);

      // Save and return the video entity
      return await this.repository.save({
        ...video,
        [`${videoMetadataTable}Id`]: videoMetadataId,
      });
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

    // Update properties of the existing video entity
    Object.assign(existingVideo, input);

    // Update relationships
    if (input.parentId) {
      existingVideo.parent = await this.repository.findOneById(input.parentId);
    }
    if (input.chunkIds) {
      existingVideo.chunks = await this.repository.findAll({
        whereIn: {
          column: 'id',
          values: input.chunkIds,
        },
      });
    }
    if (input.screenshotIds) {
      existingVideo.screenshots = await this.screenshotService.findAll({
        whereIn: { column: id, values: input.screenshotIds },
      });
    }

    // Save the updated video entity
    await this.repository.save(existingVideo);

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
