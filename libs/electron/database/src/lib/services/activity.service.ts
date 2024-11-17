import {
  IActivity,
  IActivityCreateInput,
  IActivityUpdateInput,
  IdleState,
  IRange,
  ITimeLog,
  moment,
} from '@ever-co/shared-utils';
import { Between, FindOneOptions } from 'typeorm';
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

  /**
   * Get daily statistics for a specific date range
   */
  public async getDailyStatistics(range: IRange) {
    const timeLogs = await this.timeLogService.findAll({
      where: {
        start: Between(range.start, range.end),
      },
      relations: ['activities'],
    });

    return timeLogs.reduce((acc, log) => {
      const date = moment(log.start).format('YYYY-MM-DD');
      if (!acc[date]) {
        acc[date] = {
          totalDuration: 0,
          activeDuration: 0,
          idleDuration: 0,
          productivity: 0,
        };
      }

      acc[date].totalDuration += log.duration;
      acc[date].activeDuration += this.calculateActiveDuration(log.activities);
      acc[date].idleDuration += this.calculateIdleDuration(log.activities);
      acc[date].productivity =
        (acc[date].activeDuration / acc[date].totalDuration) * 100;

      return acc;
    }, {});
  }

  /**
   * Get hourly activity distribution
   */
  public async getHourlyActivityDistribution(date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const activities = await this.activityRepository.find({
      where: {
        timeLog: {
          start: Between(startOfDay, endOfDay),
        },
      },
      relations: ['timeLog'],
    });

    const hourlyDistribution = Array(24)
      .fill(0)
      .map(() => ({
        active: 0,
        idle: 0,
        locked: 0,
      }));

    activities.forEach((activity) => {
      const hour = new Date(activity.timeLog.start).getHours();
      switch (activity.state) {
        case IdleState.ACTIVE:
          hourlyDistribution[hour].active += activity.duration;
          break;
        case IdleState.IDLE:
          hourlyDistribution[hour].idle += activity.duration;
          break;
        case IdleState.LOCKED:
          hourlyDistribution[hour].locked += activity.duration;
          break;
      }
    });

    return hourlyDistribution;
  }

  /**
   * Get productivity trends over time
   */
  public async getProductivityTrends(
    range: IRange,
    interval: 'daily' | 'weekly' | 'monthly' = 'daily'
  ) {
    const timeLogs = await this.timeLogService.findAll({
      where: {
        start: Between(range.start, range.end),
      },
      relations: ['activities'],
      order: {
        start: 'ASC',
      },
    });

    return this.aggregateProductivityByInterval(timeLogs, interval);
  }

  /**
   * Get activity state distribution
   */
  public async getActivityStateDistribution(range: IRange) {
    const activities = await this.activityRepository.find({
      where: {
        timeLog: {
          start: Between(range.start, range.end),
        },
      },
    });

    return activities.reduce((acc, activity) => {
      if (!acc[activity.state]) {
        acc[activity.state] = 0;
      }
      acc[activity.state] += activity.duration;
      return acc;
    }, {} as Record<IdleState, number>);
  }

  /**
   * Get work patterns analysis
   */
  public async getWorkPatternAnalysis(range: IRange) {
    const timeLogs = await this.timeLogService.findAll({
      where: {
        start: Between(range.start, range.end),
      },
      relations: ['activities'],
    });

    return {
      averageDailyHours: this.calculateAverageDailyHours(timeLogs),
      mostProductiveDay: this.findMostProductiveDay(timeLogs),
      mostProductiveHours: this.findMostProductiveHours(timeLogs),
      consistencyScore: this.calculateConsistencyScore(timeLogs),
    };
  }

  private calculateActiveDuration(activities: IActivity[]): number {
    return activities
      .filter((activity) => activity.state === IdleState.ACTIVE)
      .reduce((sum, activity) => sum + activity.duration, 0);
  }

  private calculateIdleDuration(activities: IActivity[]): number {
    return activities
      .filter(
        (activity) =>
          activity.state === IdleState.IDLE ||
          activity.state === IdleState.LOCKED
      )
      .reduce((sum, activity) => sum + activity.duration, 0);
  }

  private aggregateProductivityByInterval(
    timeLogs: ITimeLog[],
    interval: 'daily' | 'weekly' | 'monthly'
  ) {
    const aggregated = {};

    timeLogs.forEach((log) => {
      let key: string;
      const date = new Date(log.start);

      switch (interval) {
        case 'daily':
          key = moment(date).format('YYYY-MM-DD');
          break;
        case 'weekly':
          key = moment(date).format('YYYY-[W]WW');
          break;
        case 'monthly':
          key = moment(date).format('YYYY-MM');
          break;
      }

      if (!aggregated[key]) {
        aggregated[key] = {
          totalDuration: 0,
          activeDuration: 0,
          productivity: 0,
        };
      }

      aggregated[key].totalDuration += log.duration;
      aggregated[key].activeDuration += this.calculateActiveDuration(
        log.activities
      );
      aggregated[key].productivity =
        (aggregated[key].activeDuration / aggregated[key].totalDuration) * 100;
    });

    return aggregated;
  }

  private calculateAverageDailyHours(timeLogs: ITimeLog[]): number {
    const dailyDurations = {
      sum: 0,
      duration: 0,
    };

    timeLogs.forEach((log) => {
      const date = moment(log.start).format('YYYY-MM-DD');
      if (!dailyDurations[date]) {
        dailyDurations[date] = 0;
      }
      dailyDurations[date] += log.duration;
    });

    const totalDays = Object.keys(dailyDurations).length;
    if (totalDays === 0) return 0;

    const totalHours =
      Object.values(dailyDurations).reduce(
        (sum: number, duration: number) => sum + duration,
        0
      ) / 3600; // Convert to hours
    return totalHours / totalDays;
  }

  private findMostProductiveDay(timeLogs: ITimeLog[]): string {
    const dailyProductivity = {};

    timeLogs.forEach((log) => {
      const date = moment(log.start).format('YYYY-MM-DD');
      if (!dailyProductivity[date]) {
        dailyProductivity[date] = {
          totalDuration: 0,
          activeDuration: 0,
        };
      }

      dailyProductivity[date].totalDuration += log.duration;
      dailyProductivity[date].activeDuration += this.calculateActiveDuration(
        log.activities
      );
    });

    let mostProductiveDay = null;
    let highestProductivity = 0;

    Object.entries(dailyProductivity).forEach(([date, data]: [string, any]) => {
      const productivity = (data.activeDuration / data.totalDuration) * 100;
      if (productivity > highestProductivity) {
        highestProductivity = productivity;
        mostProductiveDay = date;
      }
    });

    return mostProductiveDay;
  }

  private findMostProductiveHours(timeLogs: ITimeLog[]): number[] {
    const hourlyProductivity = Array(24)
      .fill(0)
      .map(() => ({
        totalDuration: 0,
        activeDuration: 0,
      }));

    timeLogs.forEach((log) => {
      const hour = new Date(log.start).getHours();
      hourlyProductivity[hour].totalDuration += log.duration;
      hourlyProductivity[hour].activeDuration += this.calculateActiveDuration(
        log.activities
      );
    });

    const productivityScores = hourlyProductivity.map((data, hour) => ({
      hour,
      productivity:
        data.totalDuration > 0
          ? (data.activeDuration / data.totalDuration) * 100
          : 0,
    }));

    return productivityScores
      .sort((a, b) => b.productivity - a.productivity)
      .slice(0, 3)
      .map((score) => score.hour);
  }

  private calculateConsistencyScore(timeLogs: ITimeLog[]): number {
    const dailyDurations = {
      duration: 0,
      val: 0,
    };

    timeLogs.forEach((log) => {
      const date = moment(log.start).format('YYYY-MM-DD');
      if (!dailyDurations[date]) {
        dailyDurations[date] = 0;
      }
      dailyDurations[date] += log.duration;
    });

    const durations = Object.values(dailyDurations);
    if (durations.length < 2) return 100;

    const average =
      durations.reduce((sum: number, val: number) => sum + val, 0) /
      durations.length;
    const variance =
      durations.reduce(
        (sum: number, val: number) => sum + Math.pow(val - average, 2),
        0
      ) / durations.length;
    const standardDeviation = Math.sqrt(variance);

    // Calculate coefficient of variation (CV)
    const cv = (standardDeviation / average) * 100;

    // Convert CV to a consistency score (lower CV means higher consistency)
    return Math.max(0, 100 - cv);
  }
}
