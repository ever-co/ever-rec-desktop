import { IVideoMetadata, IVideoMetadataInput } from '@ever-co/shared-utils';
import { FindManyOptions, FindOneOptions, In } from 'typeorm';
import { VideoMetadata } from '../entities/video-metadata.entity';
import { VideoMetadataRepository } from '../repositories/video-metadata.repository';

export class VideoMetadataService {
  private readonly repository = VideoMetadataRepository.instance;

  public async save(input: IVideoMetadataInput): Promise<IVideoMetadata> {
    // Create a new Video instance and assign properties from input
    const metadata = new VideoMetadata();
    metadata.resolution = input.resolution;
    metadata.frameRate = input.frameRate;
    metadata.duration = input.duration;
    metadata.codec = input.codec;
    metadata.batch = input.batch;
    return this.repository.save(metadata);
  }

  public async findAll(options: FindManyOptions): Promise<IVideoMetadata[]> {
    return this.repository.find(options);
  }

  public async update(
    id: string,
    input: Partial<IVideoMetadataInput>
  ): Promise<IVideoMetadata> {
    // Fetch the existing video entity to update
    const existingMetadata = await this.repository.findOneBy({ id });

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

  public async findOne(options: FindOneOptions): Promise<IVideoMetadata> {
    return this.repository.findOne(options);
  }

  public async findOneById(id: string): Promise<IVideoMetadata> {
    return this.repository.findOneBy({ id });
  }

  public async delete(id: string): Promise<void> {
    await this.repository.delete({ id });
  }

  public async deleteAll(videoIds?: string[]): Promise<void> {
    await this.repository.delete(videoIds ? { id: In(videoIds) } : {});
  }
}
