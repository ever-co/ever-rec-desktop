import { IActivity } from '@ever-co/shared-utils';
import { Repository } from 'typeorm';
import { appDataSource } from '../data-source';
import { Activity } from '../entities/activity.entity';

export class ActivityRepository {
  private static _instance: Repository<IActivity>;

  public static get instance(): Repository<IActivity> {
    if (!this._instance) {
      this._instance = appDataSource.getRepository<IActivity>(Activity);
    }
    return this._instance;
  }
}
