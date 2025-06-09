import {
  IUploadDone,
  IRemoteUpload,
  IScreenshot,
  IScreenshotService,
  IScreenshotUpload,
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
      recordedAt: this.toISOString(item.metadata?.createdAt),
      pathname: FileManager.decodePath(item.pathname),
      timeSlotId: this.getTimeSlotId(),
      id: item.id,
      key: upload.key,
    }));
  }

  protected override async synchronize({ itemId, result }: IUploadDone): Promise<void> {
    await Promise.all(
      [
        this.service.update(itemId, { synced: true }),
        this.service.saveUpload<IScreenshotUpload>({
          id: itemId,
          remoteUrl: result.fullUrl,
          remoteId: result.id,
          uploadedAt: result.recordedAt,
        })
      ]
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
    if (isEmpty(config) || !config?.url) {
      return super.loadConfig();
    }

    // Safely extract base URL
    const url = new URL(config.url);
    const baseUrl = `${url.protocol}//${url.host}`;
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
