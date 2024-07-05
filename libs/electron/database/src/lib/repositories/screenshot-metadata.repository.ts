import { IScreenshotMetadata } from '@prototype/shared/utils';
import { Repository } from 'typeorm';
import { appDataSource } from '../data-source';
import { ScreenshotMetadata } from '../entities/screenshot-metadata.entity';

export class ScreenshotMetadataRepository {
  private static _instance: Repository<IScreenshotMetadata>;

  public static get instance(): Repository<IScreenshotMetadata> {
    if (!this._instance) {
      this._instance =
        appDataSource.getRepository<IScreenshotMetadata>(ScreenshotMetadata);
    }
    return this._instance;
  }
}
