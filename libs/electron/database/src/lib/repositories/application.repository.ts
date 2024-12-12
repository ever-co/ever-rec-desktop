import { IApplication } from '@ever-co/shared-utils';
import { Repository } from 'typeorm';
import { appDataSource } from '../data-source';
import { Application } from '../entities/application.entity';

export class ApplicationRepository {
  private static _instance: Repository<IApplication>;

  public static get instance(): Repository<IApplication> {
    if (!this._instance) {
      this._instance = appDataSource.getRepository<IApplication>(Application);
    }
    return this._instance;
  }
}
