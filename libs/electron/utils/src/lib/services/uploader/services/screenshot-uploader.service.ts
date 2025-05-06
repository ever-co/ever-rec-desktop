import {
  IScreenshot,
  IScreenshotService,
  isEmpty,
  IUpload,
} from '@ever-co/shared-utils';
import { In } from 'typeorm';
import { FileManager } from '../../files/file-manager';
import { GauzyUploaderStrategy } from '../strategies/gauzy.uploader';
import { UploaderService } from './uploader.service';

export class ScreenshotUploaderService extends UploaderService<IScreenshot> {
  constructor(service: IScreenshotService) {
    super(service);
  }

  protected override async prepareFiles(upload: IUpload) {
    const data = await this.service.findAll({
      where: { id: In(upload.ids) },
      relations: ['metadata'],
    });

    return data.map((item: IScreenshot) => ({
      recordedAt: item.metadata?.createdAt,
      pathname: FileManager.decodePath(item.pathname),
      key: upload.key,
    }));
  }

  protected override async synchronize(upload: IUpload): Promise<void> {
    await Promise.all(
      upload.ids.map((id) => this.service.update(id, { synced: true }))
    );
  }

  protected override async loadConfig() {
    // Early return if not using GauzyUploaderStrategy
    if (!(this.context.strategy instanceof GauzyUploaderStrategy)) {
      return super.loadConfig();
    }

    const strategy = this.context.strategy as GauzyUploaderStrategy;
    const config = strategy.config();

    // Use parent's config if current config is empty
    if (isEmpty(config)) {
      return super.loadConfig();
    }

    // Safely extract base URL
    const baseUrl = config?.url?.split('/api')[0];
    if (!baseUrl) {
      console.warn('Invalid URL format in uploader config');
      return super.loadConfig();
    }

    // Construct new config
    return {
      ...config,
      url: `${baseUrl}/api/timesheet/screenshot`,
    };
  }
}
