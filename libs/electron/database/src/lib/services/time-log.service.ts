import { ElectronLogger } from '@ever-co/electron-utils';
import {
  ILoggable,
  ILogger,
  ITimeLog,
  ITimeLogSave,
  ITimeLogUpdate,
} from '@ever-co/shared-utils';
import * as moment from 'moment';
import { Brackets, FindManyOptions, FindOneOptions, In, IsNull } from 'typeorm';
import { TimeLog } from '../entities/time-log.entity';
import { TimeLogRepository } from '../repositories/time-log.repository';

export class TimeLogService implements ILoggable {
  public logger: ILogger = new ElectronLogger('App:TimeLogService');
  private readonly repository = TimeLogRepository.instance;

  public async save(input: ITimeLogSave): Promise<ITimeLog> {
    const timeLog = new TimeLog();
    timeLog.start = input.start ?? moment().toISOString();
    timeLog.running = input.running;
    return this.repository.save(timeLog);
  }

  public running(): Promise<ITimeLog | null> {
    this.logger.info('Get running time log');
    return this.findOne({
      where: {
        running: true,
        end: IsNull(),
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
    }else {
      this.logger.info('No running time log');
    }
  }

  public async updateDuration(): Promise<void> {
    this.logger.info('Update time log duration');
    const timeLog = await this.running();
    if (timeLog) {
      const duration = moment().diff(timeLog.start, 'seconds', true);
      await this.repository.update(timeLog.id, { duration });
    }else {
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
}
