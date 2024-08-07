import { IScreenshotMetadata } from '@ever-capture/shared/utils';
import { FindManyOptions, FindOneOptions, In } from 'typeorm';
import { ScreenshotMetadata } from '../entities/screenshot-metadata.entity';
import { ScreenshotMetadataRepository } from '../repositories/screenshot-metadata.repository';

export class ScreenshotMetadataService {
  private static readonly repository = ScreenshotMetadataRepository.instance;

  public static async save(
    metadata: Partial<IScreenshotMetadata>
  ): Promise<IScreenshotMetadata> {
    const screenshotMetadata = new ScreenshotMetadata();
    screenshotMetadata.description = metadata.description;
    screenshotMetadata.icon = metadata.icon;
    screenshotMetadata.name = metadata.name;
    return this.repository.save(screenshotMetadata);
  }

  public static async findAll(
    options: FindManyOptions
  ): Promise<IScreenshotMetadata[]> {
    return this.repository.find(options);
  }

  public static async update(
    id: string,
    metadata: Partial<IScreenshotMetadata>
  ): Promise<IScreenshotMetadata> {
    await this.repository.update(id, metadata);
    return this.findOneById(id);
  }

  public static async findOne(
    options: FindOneOptions
  ): Promise<IScreenshotMetadata> {
    return this.repository.findOne(options);
  }

  public static async findOneById(id: string): Promise<IScreenshotMetadata> {
    return this.repository.findOneBy({ id });
  }

  public static async delete(id: string): Promise<void> {
    await this.repository.delete({ id });
  }

  public static async deleteAll(metadataIds?: string[]): Promise<void> {
    await this.repository.delete(metadataIds ? { id: In(metadataIds) } : {});
  }
}
