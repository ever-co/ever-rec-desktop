import { Repository } from 'typeorm';
import { appDataSource } from '../data-source';
import { Screenshot } from '../entities/screenshot.entity';

export class ScreenshotRepository {
  private static _instance: Repository<Screenshot>;

  public static get instance(): Repository<Screenshot> {
    if (!this._instance) {
      this._instance = appDataSource.getRepository(Screenshot);
    }
    return this._instance;
  }
}
