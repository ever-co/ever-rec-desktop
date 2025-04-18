import { IPhotoMetadata } from '@ever-co/shared-utils';
import { PhotoMetadata } from '../entities/metadata.entity';
import { Repository } from 'typeorm';
import { appDataSource } from '../data-source';

export class PhotoMetadataRepository {
  private static _instance: Repository<IPhotoMetadata>;

  public static get instance(): Repository<IPhotoMetadata> {
    if (!this._instance) {
      this._instance =
        appDataSource.getRepository<IPhotoMetadata>(PhotoMetadata);
    }
    return this._instance;
  }
}
