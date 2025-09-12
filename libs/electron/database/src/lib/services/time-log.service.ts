import { ElectronLogger } from '@ever-co/electron-utils';
import {
  ILoggable,
  ILogger,
  IRange,
  ITimeLog,
  ITimeLogSave,
  ITimeLogUpdate,
  moment,
} from '@ever-co/shared-utils';
import {
  Between,
  Brackets,
  FindManyOptions,
  FindOneOptions,
  In,
  IsNull,
} from 'typeorm';
import { TimeLog } from '../entities/time-log.entity';
import { TimeLogRepository } from '../repositories/time-log.repository';
import { UserSessionService } from './user-session.service';

export class TimeLogService implements ILoggable {
  public logger: ILogger = new ElectronLogger('App:TimeLogService');
  private readonly repository = TimeLogRepository.instance;
  private readonly userSessionService = new UserSessionService();

  public async save(input: ITimeLogSave): Promise<ITimeLog> {
    const timeLog = new TimeLog();
    timeLog.start = input.start ?? moment().toISOString();
    timeLog.running = input.running;
    return this.repository.save(timeLog);
  }

  public async running(): Promise<ITimeLog | null> {
    this.logger.info('Get running time log');
    const user = await this.userSessionService.currentUser();

    return this.findOne({
      where: {
        running: true,
        end: IsNull(),
        session: {
          user: {
            id: user.id
          }
        }
      },
    });
  }

  public async findAll(options = {} as FindManyOptions): Promise<ITimeLog[]> {
    return this.repository.find(options);
  }

  public async findAndCount(options?: FindManyOptions<ITimeLog>) {
    return this.repository.findAndCount(options);
  }

  public async update(id: string, update: ITimeLogUpdate): Promise<ITimeLog> {
    await this.repository.update(id, update);

    return this.findOneById(id);
  }

  public async stop(): Promise<void> {
    this.logger.info('Stop time log');
    const timeLog = await this.running();
    if (timeLog) {
      const end = moment().toISOString();
      const running = false;
      const duration = moment().diff(timeLog.start, 'seconds', true);
      await this.repository.update(timeLog.id, { end, running, duration });
    } else {
      this.logger.info('No running time log');
    }
  }

  public async updateDuration(): Promise<void> {
    this.logger.info('Update time log duration');
    const timeLog = await this.running();
    if (timeLog) {
      const duration = moment().diff(timeLog.start, 'seconds', true);
      await this.repository.update(timeLog.id, { duration });
    } else {
      this.logger.info('No running time log');
    }
  }

  public async start(): Promise<ITimeLog> {
    this.logger.info('Start time log');
    await this.purgeConflictsIfExists();
    return this.save({ running: true });
  }

  private async purgeConflictsIfExists() {
    this.logger.info('Purge conflicts if exists');

    const timelogs = await this.repository
      .createQueryBuilder('timeLog')
      .where(
        new Brackets((qb) => {
          qb.where('timeLog.end IS NULL').orWhere(
            'timeLog.running = :running',
            { running: true }
          );
        })
      )
      .getMany();

    if (!timelogs.length) {
      this.logger.info('No conflicts to purge');
      return;
    }

    for (const timelog of timelogs) {
      this.logger.info(`Purge conflict ID: ${timelog.id}`);
      const { start, duration } = timelog;
      const end = moment(start).add(duration, 'seconds').toISOString();
      await this.repository.update(timelog.id, { running: false, end });
    }
  }

  public async findOne(options: FindOneOptions): Promise<ITimeLog> {
    return this.repository.findOne(options);
  }

  public async findOneById(id: string): Promise<ITimeLog> {
    return this.repository.findOneBy({ id });
  }

  public async delete(id: string): Promise<void> {
    await this.repository.delete({ id });
  }

  public async deleteAll(screenshotIds?: string[]): Promise<void> {
    await this.repository.delete(
      screenshotIds ? { id: In(screenshotIds) } : {}
    );
  }

  public async statistics({ start, end }): Promise<number> {
    const user = await this.userSessionService.currentUser();
    const sum = await this.repository.sum('duration', {
      createdAt: Between(start, end),
      session: {
        user: {
          id: user.id
        }
      }
    });
    return sum || 0;
  }

  public async findLatest(): Promise<ITimeLog | null> {
    this.logger.info('Get last time log');
    const user = await this.userSessionService.currentUser();

    return this.repository
      .createQueryBuilder('time_log')
      .leftJoin('time_log.session', 'session')
      .leftJoin('session.user', 'user')
      .where('user.id = :userId', { userId: user.id })
      .orderBy('time_log.createdAt', 'DESC')
      .limit(1)
      .getOne();
  }

  public async getContext({
    range,
    id,
  }: {
    range?: IRange;
    id?: string;
  }): Promise<string> {
    const user = await this.userSessionService.currentUser();

    const query = this.repository
      .createQueryBuilder('time_log')
      .leftJoin('time_log.screenshots', 'screenshot')
      .leftJoin('screenshot.metadata', 'metadata')
      .leftJoin('time_log.session', 'session')
      .leftJoin('session.user', 'user')
      .select("GROUP_CONCAT(DISTINCT metadata.description)", 'context')
      .andWhere('user.id = :userId', { userId: user.id });

    if (id) {
      query
        .andWhere('time_log.id = :id', { id })
        .addSelect('time_log.duration', 'duration');
    }

    if (range) {
      query.andWhere('time_log.createdAt BETWEEN :start AND :end', {
        start: range.start,
        end: range.end,
      });
    }

    query.groupBy('time_log.id');

    const result = await query.getRawOne<{ context: string; duration?: number }>();

    // normalize context
    const descriptions = result?.context
      ? result.context.split(',').join(';') // replace default `,` with `;`
      : 'Not working';

    // duration logic
    let duration = 0;
    if (id && result?.duration) {
      duration = result.duration;
    } else if (range) {
      duration = await this.repository.sum('duration', {
        createdAt: Between(String(range.start), String(range.end)),
        session: { user: { id: user.id } },
      });
    }

    return JSON.stringify({
      context: descriptions,
      worked: `${duration || 0} seconds`,
    });
  }
}
