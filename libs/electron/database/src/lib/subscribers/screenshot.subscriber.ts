import { ElectronLogger } from '@ever-co/electron-utils';
import { ILoggable, ILogger } from '@ever-co/shared-utils';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { Screenshot } from '../entities/screenshot.entity';
import { TimeLogService } from '../services/time-log.service';

@EventSubscriber()
export class ScreenshotSubscriber
  implements EntitySubscriberInterface<Screenshot>, ILoggable
{
  logger: ILogger = new ElectronLogger('ScreenshotSubscriber');
  timeLog = new TimeLogService();

  public listenTo() {
    return Screenshot;
  }

  public async beforeInsert(event: InsertEvent<Screenshot>): Promise<void> {
    this.logger.info('Prepare screenshot');
    const timeLog = await this.timeLog.findLatest();
    if (timeLog) {
      this.logger.info('Add time log to screenshot');
      event.entity.timeLog = timeLog;
    }
  }

  public async afterInsert(event: InsertEvent<Screenshot>): Promise<void> {
    this.logger.info('Entity inserted ID:', event.entityId);
    await this.timeLog.updateDuration();
  }

  public async afterUpdate(event: UpdateEvent<Screenshot>): Promise<void> {
    this.logger.info(`Entity updated ID`, event.entity);
  }

  public async afterRemove(event: RemoveEvent<Screenshot>): Promise<void> {
    this.logger.info('Entity deleted');
  }
}
