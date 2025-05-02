import { IAudioMetadata } from '@ever-co/shared-utils';
import { Repository } from 'typeorm';
import { appDataSource } from '../data-source';
import { AudioMetadata } from '../entities/audio-metadata.entity';

export class AudioMetadataRepository {
  private static _instance: Repository<IAudioMetadata>;

  public static get instance(): Repository<IAudioMetadata> {
    if (!this._instance) {
      this._instance =
        appDataSource.getRepository<IAudioMetadata>(AudioMetadata);
    }
    return this._instance;
  }
}
