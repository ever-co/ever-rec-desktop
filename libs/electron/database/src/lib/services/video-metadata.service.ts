import {
  IVideoMetadata,
  IVideoMetadataInput,
} from '@ever-capture/shared-utils';
import { VideoMetadata } from '../entities/video-metadata.entity';
import { VideoMetadataRepository } from '../repositories/video-metadata.repository';

export class VideoMetadataService {
  private readonly repository = new VideoMetadataRepository();

  public async save(input: IVideoMetadataInput): Promise<IVideoMetadata> {
    // Create a new Video instance and assign properties from input
    const metadata = new VideoMetadata(input);
    const resolution = metadata.resolution;
    const frameRate = metadata.frameRate;
    const duration = metadata.duration;
    const codec = metadata.codec;
    const batch = metadata.batch;
    return this.repository.save({
      resolution,
      frameRate,
      duration,
      codec,
      batch,
    });
  }

  public async findAll(options): Promise<IVideoMetadata[]> {
    return this.repository.find(options);
  }

  public async update(
    id: string,
    input: Partial<IVideoMetadataInput>
  ): Promise<IVideoMetadata> {
    // Fetch the existing video entity to update
    const existingMetadata = await this.repository.findOneById(id);

    if (!existingMetadata) {
      throw new Error(`Metadata with ID ${id} not found`);
    }

    // Update properties of the existing video entity
    Object.assign(existingMetadata, {
      resolution: input.resolution,
      frameRate: input.frameRate,
      duration: input.duration,
      codec: input.codec,
      batch: input.batch,
    });

    // Save the updated video entity
    await this.repository.save(existingMetadata);

    // Return the updated video entity
    return this.findOneById(id);
  }

  public async findOne(options): Promise<IVideoMetadata> {
    return this.repository.findOne(options);
  }

  public async findOneById(id: string): Promise<IVideoMetadata> {
    return this.repository.findOneById(id);
  }

  public async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  public async deleteAll(screenshotIds?: string[]): Promise<void> {
    this.repository.deleteAll(screenshotIds);
  }
}
