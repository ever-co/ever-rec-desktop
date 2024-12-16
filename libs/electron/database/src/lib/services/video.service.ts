import { IVideo, IVideoInput, IVideoService } from '@ever-co/shared-utils';
import { FindManyOptions, FindOneOptions, In } from 'typeorm';
import { Video } from '../entities/video.entity';
import { VideoRepository } from '../repositories/video.repository';
import { ScreenshotService } from './screenshot.service';
import { TimeLogService } from './time-log.service';
import { VideoMetadataService } from './video-metadata.service';

export class VideoService implements IVideoService {
  private readonly metadataService = new VideoMetadataService();
  private readonly screenshotService = new ScreenshotService();
  private readonly timeLogService = new TimeLogService();
  private readonly repository = VideoRepository.instance;

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
          withDeleted: true
        });
        if (screenshots.length !== input.screenshotIds.length) {
          throw new Error('Some screenshots were not found');
        }
        video.screenshots = screenshots;
      }

      // Handle time log association
      if (input.timeLogId) {
        const timeLog = await this.timeLogService.findOneById(input.timeLogId);
        if (!timeLog) {
          throw new Error(
            `Time Log video with ID ${input.timeLogId} not found`
          );
        }
        video.timeLog = timeLog;
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

  public async findAndCount(options?: FindManyOptions<IVideo>) {
    return this.repository.findAndCount(options);
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
    // Update parent
    if (input.parentId) {
      existingVideo.parent = await this.repository.findOneBy({
        id: input.parentId,
      });
    }

    // Update chunks
    if (input.chunkIds) {
      existingVideo.chunks = await this.repository.findBy({
        id: In(input.chunkIds),
      });
    }

    // Update screenshots
    if (input.screenshotIds) {
      existingVideo.screenshots = await this.screenshotService.findAll({
        where: { id: In(input.screenshotIds) },
      });
    }

    // Update time Log
    if (input.timeLogId) {
      existingVideo.timeLog = await this.timeLogService.findOneById(
        input.timeLogId
      );
    }

    // Save the updated video entity
    await this.repository.update(id, existingVideo);

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
