import { IVideo, IVideoInput, IVideoService } from '@ever-capture/shared-utils';
import { FindManyOptions, FindOneOptions, In } from 'typeorm';
import { Video } from '../entities/video.entity';
import { VideoRepository } from '../repositories/video.repository';
import { ScreenshotService } from './screenshot.service';
import { VideoMetadataService } from './video-metadata.service';

export class VideoService implements IVideoService {
  private readonly repository = VideoRepository.instance;
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
        const parentVideo = await this.repository.findOneBy({
          id: input.parentId,
        });
        if (!parentVideo) {
          throw new Error(`Parent video with ID ${input.parentId} not found`);
        }
        video.parent = parentVideo;
      }

      // Handle chunk associations
      if (input.chunkIds) {
        const chunks = await this.repository.findBy({ id: In(input.chunkIds) });
        if (chunks.length !== input.chunkIds.length) {
          throw new Error('Some chunks were not found');
        }
        video.chunks = chunks;
      }

      // Handle screenshot associations
      if (input.screenshotIds) {
        const screenshots = await this.screenshotService.findAll({
          where: { id: In(input.screenshotIds) },
        });
        if (screenshots.length !== input.screenshotIds.length) {
          throw new Error('Some screenshots were not found');
        }
        video.screenshots = screenshots;
      }

      const metadata = await this.metadataService.save(input);
      video.metadata = metadata;

      // Save and return the video entity
      return await this.repository.save(video);
    } catch (error) {
      console.error('Error saving video:', error);
      throw new Error('Error saving video');
    }
  }

  public async findAll(options: FindManyOptions): Promise<IVideo[]> {
    return this.repository.find(options);
  }

  public async update(
    id: string,
    input: Partial<IVideoInput>
  ): Promise<IVideo> {
    // Fetch the existing video entity to update
    const existingVideo = await this.repository.findOneBy({ id });

    if (!existingVideo) {
      throw new Error(`Video with ID ${id} not found`);
    }

    // Update properties of the existing video entity
    Object.assign(existingVideo, input);

    // Update relationships
    if (input.parentId) {
      existingVideo.parent = await this.repository.findOneBy({
        id: input.parentId,
      });
    }
    if (input.chunkIds) {
      existingVideo.chunks = await this.repository.findBy({
        id: In(input.chunkIds),
      });
    }
    if (input.screenshotIds) {
      existingVideo.screenshots = await this.screenshotService.findAll({
        where: { id: In(input.screenshotIds) },
      });
    }

    // Save the updated video entity
    await this.repository.save(existingVideo);

    // Return the updated video entity
    return this.findOneById(id);
  }

  public async findOne(options: FindOneOptions): Promise<IVideo> {
    return this.repository.findOne(options);
  }

  public async findOneById(id: string): Promise<IVideo> {
    return this.repository.findOneBy({ id });
  }

  public async delete(id: string): Promise<void> {
    await this.repository.delete({ id });
  }

  public async deleteAll(videoIds?: string[]): Promise<void> {
    await this.repository.delete(videoIds ? { id: In(videoIds) } : {});
  }
}
