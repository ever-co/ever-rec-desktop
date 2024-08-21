import { IScreenshotMetadata } from '@ever-capture/shared-utils';
import { ScreenshotMetadata } from '../entities/screenshot-metadata.entity';
import { ScreenshotMetadataRepository } from '../repositories/screenshot-metadata.repository';

export class ScreenshotMetadataService {
  private static readonly repository = new ScreenshotMetadataRepository();

  public static async save(
    metadata: Partial<IScreenshotMetadata>
  ): Promise<IScreenshotMetadata> {
    const screenshotMetadata = new ScreenshotMetadata(metadata);
    const description = screenshotMetadata.description;
    const icon = screenshotMetadata.icon;
    const name = screenshotMetadata.name;
    return this.repository.save({ description, icon, name });
  }

  public static async findAll(options): Promise<IScreenshotMetadata[]> {
    return this.repository.findAll(options);
  }

  public static async update(
    id: string,
    metadata: any
  ): Promise<IScreenshotMetadata> {
    await this.repository.update(id, metadata);
    return this.findOneById(id);
  }

  public static async findOne(options): Promise<IScreenshotMetadata> {
    return this.repository.findOne(options);
  }

  public static async findOneById(id: string): Promise<IScreenshotMetadata> {
    return this.repository.findOneById(id);
  }

  public static async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  public static async deleteAll(metadataIds?: string[]): Promise<void> {
    await this.repository.deleteAll(metadataIds);
  }
}
