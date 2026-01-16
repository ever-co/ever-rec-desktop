import { IUserPersistance } from '@ever-co/shared-utils';
import { Repository } from 'typeorm';
import { appDataSource } from '../data-source';
import { User } from '../entities/user.entity';

export class UserRepository {
  private static _instance: Repository<IUserPersistance>;

  public static get instance(): Repository<IUserPersistance> {
    if (!this._instance) {
      this._instance = appDataSource.getRepository<IUserPersistance>(User);
    }
    return this._instance;
  }
}
