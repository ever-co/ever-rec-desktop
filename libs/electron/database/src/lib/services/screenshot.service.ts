import {
  IScreenshot,
  IScreenshotChartLine,
  IScreenshotInput,
  IScreenshotService,
  moment,
} from '@ever-co/shared-utils';
import { FindManyOptions, FindOneOptions, In } from 'typeorm';
import { Screenshot } from '../entities/screenshot.entity';
import { ScreenshotRepository } from '../repositories/screenshot.repository';
import { ScreenshotMetadataService } from './screenshot-metadata.service';

export class ScreenshotService implements IScreenshotService {
  private readonly repository = ScreenshotRepository.instance;
  private readonly metadataService = ScreenshotMetadataService;

  public async save(input: IScreenshotInput): Promise<IScreenshot> {
    const screenshot = new Screenshot();
    screenshot.pathname = input.pathname;
    screenshot.metadata = await this.metadataService.save(input.metadata);
    return this.repository.save(screenshot);
  }

  public async findAll(options: FindManyOptions): Promise<IScreenshot[]> {
    return this.repository.find(options);
  }

  public async findAndCount(options?: FindManyOptions<IScreenshot>) {
    return this.repository.findAndCount(options);
  }

  public async update(
    id: string,
    screenshot: Partial<IScreenshot>
  ): Promise<IScreenshot> {
    await this.repository.update(id, screenshot);
    return this.findOneById(id);
  }

  public async updateMany(
    ids: string[],
    screenshot: Partial<IScreenshot>
  ): Promise<void> {
    await this.repository.update({ id: In(ids) }, screenshot);
  }

  public async findOne(options: FindOneOptions): Promise<IScreenshot> {
    return this.repository.findOne(options);
  }

  public async findOneById(id: string): Promise<IScreenshot> {
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

  public async groupScreenshotsByHour(): Promise<IScreenshotChartLine[]> {
    const screenshotsGroupedByHour = await this.repository
      .createQueryBuilder('screenshot')
      .select("strftime('%H', screenshot.createdAt)", 'hour')
      .addSelect('COUNT(screenshot.id)', 'count')
      .where("DATE(screenshot.createdAt) = DATE('now')")
      .groupBy('hour')
      .orderBy('hour', 'ASC')
      .getRawMany();

    const userTimezone = moment.tz.guess();
    // Convert the map to an array of objects
    return screenshotsGroupedByHour.map((row) => ({
      timeSlot: moment.utc(row.hour, 'HH').tz(userTimezone).format('HH[h]'),
      count: row.count,
    }));
  }

  public async groupScreenshotsByTenMinutes(): Promise<IScreenshotChartLine[]> {
    const screenshotsGroupedByTenMinutes = await this.repository
      .createQueryBuilder('screenshot')
      .select("strftime('%Y-%m-%d %H', screenshot.createdAt)", 'date_hour')
      .addSelect(
        "CAST((strftime('%M', screenshot.createdAt) / 10) * 10 AS INTEGER)",
        'minute_group'
      )
      .addSelect('COUNT(screenshot.id)', 'count')
      .where("DATE(screenshot.createdAt) = DATE('now')")
      .groupBy('date_hour, minute_group')
      .orderBy('date_hour, minute_group', 'ASC')
      .getRawMany();

    const userTimezone = moment.tz.guess();

    return screenshotsGroupedByTenMinutes.map((row) => ({
      timeSlot: moment
        .utc(`${row.date_hour}:${row.minute_group.toString().padStart(2, '0')}`)
        .tz(userTimezone)
        .format('H[h]m[m]'),
      count: parseInt(row.count, 10),
    }));
  }

  public async groupScreenshotsByMinute(): Promise<IScreenshotChartLine[]> {
    const screenshotsGroupedByMinute = await this.repository
      .createQueryBuilder('screenshot')
      .select("strftime('%Y-%m-%d %H:%M', screenshot.createdAt)", 'date_minute')
      .addSelect('COUNT(screenshot.id)', 'count')
      .where("DATE(screenshot.createdAt) = DATE('now')")
      .groupBy('date_minute')
      .orderBy('date_minute', 'ASC')
      .getRawMany();

    const userTimezone = moment.tz.guess();

    return screenshotsGroupedByMinute.map((row) => ({
      timeSlot: moment
        .utc(row.date_minute, 'YYYY-MM-DD HH:mm')
        .tz(userTimezone)
        .format('H[h]mm[m]'), // The timestamp formatted as YYYY-MM-DD HH:mm
      count: parseInt(row.count, 10),
    }));
  }
}
