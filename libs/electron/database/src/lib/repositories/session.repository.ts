import { ISession } from '@ever-co/shared-utils';
import { Repository } from 'typeorm';
import { appDataSource } from '../data-source';
import { Session } from '../entities/session.entity';

export class SessionRepository {
  private static _instance: Repository<ISession>;

  public static get instance(): Repository<ISession> {
    if (!this._instance) {
      this._instance = appDataSource.getRepository<ISession>(Session);
    }
    return this._instance;
  }
}
