import { IScreenshot } from '@prototype/shared/utils';
import { Repository } from 'typeorm';
import { appDataSource } from '../data-source';
import { Screenshot } from '../entities/screenshot.entity';

export class ScreenshotRepository {
  private static _instance: Repository<IScreenshot>;

  public static get instance(): Repository<IScreenshot> {
    if (!this._instance) {
      this._instance = appDataSource.getRepository<IScreenshot>(Screenshot);
    }
    return this._instance;
  }
}
