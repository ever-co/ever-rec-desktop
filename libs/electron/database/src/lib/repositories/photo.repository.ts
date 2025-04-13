import { Repository } from 'typeorm';
import { appDataSource } from '../data-source';
import { Photo } from '../entities/photo.entity';
import { IPhoto } from '@ever-co/shared-utils';

export class PhotoRepository {
  private static _instance: Repository<IPhoto>;

  public static get instance(): Repository<IPhoto> {
    if (!this._instance) {
      this._instance = appDataSource.getRepository<IPhoto>(Photo);
    }
    return this._instance;
  }
}
