import { IVideo } from '@ever-capture/shared-utils';
import { Repository } from 'typeorm';
import { appDataSource } from '../data-source';
import { Video } from '../entities/video.entity';

export class VideoRepository {
  private static _instance: Repository<IVideo>;

  public static get instance(): Repository<IVideo> {
    if (!this._instance) {
      this._instance = appDataSource.getRepository<IVideo>(Video);
    }
    return this._instance;
  }
}
