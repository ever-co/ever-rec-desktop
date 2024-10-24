import { ITimeLog } from '@ever-co/shared-utils';
import { Repository } from 'typeorm';
import { appDataSource } from '../data-source';
import { TimeLog } from '../entities/time-log.entity';

export class TimeLogRepository {
  private static _instance: Repository<ITimeLog>;

  public static get instance(): Repository<ITimeLog> {
    if (!this._instance) {
      this._instance = appDataSource.getRepository<ITimeLog>(TimeLog);
    }
    return this._instance;
  }
}
