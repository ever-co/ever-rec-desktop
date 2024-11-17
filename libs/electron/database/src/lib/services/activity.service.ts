import {
  IActivity,
  IActivityCreateInput,
  IActivityUpdateInput,
} from '@ever-co/shared-utils';
import { FindOneOptions } from 'typeorm';
import { Activity } from '../entities/activity.entity';
import { ActivityRepository } from '../repositories/activity.repository';
import { TimeLogService } from './time-log.service';

export class ActivityService {
  private activityRepository = ActivityRepository.instance;
  private timeLogService = new TimeLogService();

  public async save(input: IActivityCreateInput): Promise<IActivity> {
    const activity = new Activity();

    activity.duration = input.duration;
    activity.state = input.state;

    if (input.timeLogId) {
      activity.timeLog = await this.timeLogService.findOneById(input.timeLogId);
    }

    return this.activityRepository.save(activity);
  }

  public async lastActivity(timeLogId?: string): Promise<IActivity | null> {
    const query = this.activityRepository.createQueryBuilder('activity');
    if (timeLogId) {
      query.where('activity.timeLogId = :timeLogId', { timeLogId });
    }

    return query.orderBy('activity.createdAt', 'DESC').take(1).getOne();
  }

  public async findOne(options: FindOneOptions): Promise<IActivity> {
    return this.activityRepository.findOne(options);
  }

  public async update(
    id: string,
    activity: IActivityUpdateInput
  ): Promise<IActivity> {
    await this.activityRepository.update(id, activity);
    return this.findOne({ where: { id } });
  }
}
