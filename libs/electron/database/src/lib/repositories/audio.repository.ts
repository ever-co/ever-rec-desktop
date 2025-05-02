import { Repository } from 'typeorm';
import { appDataSource } from '../data-source';
import { IAudio } from '@ever-co/shared-utils';
import { Audio } from '../entities/audio.entity';

export class AudioRepository {
  private static _instance: Repository<IAudio>;

  public static get instance(): Repository<IAudio> {
    if (!this._instance) {
      this._instance = appDataSource.getRepository<IAudio>(Audio);
    }
    return this._instance;
  }
}
