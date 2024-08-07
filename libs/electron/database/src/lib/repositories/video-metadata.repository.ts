import { IVideoMetadata } from '@ever-capture/shared/utils';
import { Repository } from 'typeorm';
import { appDataSource } from '../data-source';
import { VideoMetadata } from '../entities/video-metadata.entity';

export class VideoMetadataRepository {
  private static _instance: Repository<IVideoMetadata>;

  public static get instance(): Repository<IVideoMetadata> {
    if (!this._instance) {
      this._instance =
        appDataSource.getRepository<IVideoMetadata>(VideoMetadata);
    }
    return this._instance;
  }
}
