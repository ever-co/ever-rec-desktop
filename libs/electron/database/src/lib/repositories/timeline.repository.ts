import { ITimeline } from '@ever-co/shared-utils';
import { Repository } from 'typeorm';
import { appDataSource } from '../data-source';
import { Timeline } from '../entities/timeline.entity';

export class TimelineRepository {
  private static _instance: Repository<ITimeline>;

  public static get instance(): Repository<ITimeline> {
    if (!this._instance) {
      this._instance = appDataSource.getRepository<ITimeline>(Timeline);
    }
    return this._instance;
  }
}
