import { IScreenshot, IScreenshotInput } from '@ever-capture/shared-utils';
import { FindManyOptions, FindOneOptions, In } from 'typeorm';
import { Screenshot } from '../entities/screenshot.entity';
import { ScreenshotRepository } from '../repositories/screenshot.repository';
import { ScreenshotMetadataService } from './screenshot-metadata.service';

export class ScreenshotService {
  private static readonly repository = ScreenshotRepository.instance;
  private static readonly metadataService = ScreenshotMetadataService;

  public static async save(input: IScreenshotInput): Promise<IScreenshot> {
    const screenshot = new Screenshot();
    screenshot.pathname = input.pathname;
    screenshot.metadata = await this.metadataService.save(input.metadata);
    return this.repository.save(screenshot);
  }

  public static async findAll(
    options: FindManyOptions
  ): Promise<IScreenshot[]> {
    return this.repository.find(options);
  }

  public static async update(
    id: string,
    screenshot: Partial<IScreenshot>
  ): Promise<IScreenshot> {
    await this.repository.update(id, screenshot);
    return this.findOneById(id);
  }

  public static async findOne(options: FindOneOptions): Promise<IScreenshot> {
    return this.repository.findOne(options);
  }

  public static async findOneById(id: string): Promise<IScreenshot> {
    return this.repository.findOneBy({ id });
  }

  public static async delete(id: string): Promise<void> {
    await this.repository.delete({ id });
  }

  public static async deleteAll(screenshotIds?: string[]): Promise<void> {
    await this.repository.delete(
      screenshotIds ? { id: In(screenshotIds) } : {}
    );
  }
}
