import { IScreenshot, IScreenshotInput } from '@ever-capture/shared-utils';
import { screenshotMetadataTable } from '../repositories/screenshot-metadata.repository';
import {
  ScreenshotRepository
} from '../repositories/screenshot.repository';
import { ScreenshotMetadataService } from './screenshot-metadata.service';

export class ScreenshotService {
  private static readonly repository = new ScreenshotRepository();
  private static readonly metadataService = ScreenshotMetadataService;

  public static async save(input: IScreenshotInput): Promise<IScreenshot> {
    const pathname = input.pathname;
    const metadata = await this.metadataService.save(input.metadata);
    const screenshot = await this.repository.save({
      pathname,
      [`${screenshotMetadataTable}Id`]: metadata.id,
    });
    return this.repository.findOneWithMetadataById(screenshot.id);
  }

  public static async findAll(options): Promise<IScreenshot[]> {
    return this.repository.findAll(options);
  }

  public static async findAllWithMetadata(screenshotIds?: string[]): Promise<IScreenshot[]> {
    return this.repository.findAllScreenshotsWithMetadata(screenshotIds);
  }

  public static async findScreenshotsByDescription(
    description: string
  ): Promise<IScreenshot[]> {
    return this.repository.findAllByDescription(description);
  }

  public static async update(
    id: string,
    screenshot: Partial<IScreenshot>
  ): Promise<IScreenshot> {
    await this.repository.update(id, screenshot);
    return this.findOneById(id);
  }

  public static async findOne(options): Promise<IScreenshot> {
    return this.repository.findOne(options);
  }

  public static async findOneById(id: string): Promise<IScreenshot> {
    return this.repository.findOneById(id);
  }

  public static async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  public static async deleteAll(screenshotIds?: string[]): Promise<void> {
    this.repository.deleteAll(screenshotIds);
  }
}
