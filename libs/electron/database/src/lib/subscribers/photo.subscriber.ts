import { ElectronLogger } from '@ever-co/electron-utils';
import { ILoggable, ILogger } from '@ever-co/shared-utils';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { Photo } from '../entities/photo.entity';
import { TimeLogService } from '../services/time-log.service';

@EventSubscriber()
export class PhotoSubscriber
  implements EntitySubscriberInterface<Photo>, ILoggable
{
  logger: ILogger = new ElectronLogger('PhotoSubscriber');
  timeLog = new TimeLogService();

  public listenTo() {
    return Photo;
  }

  public async beforeInsert(event: InsertEvent<Photo>): Promise<void> {
    this.logger.info('Prepare photo...');
    const timeLog = await this.timeLog.running();

    if (timeLog) {
      this.logger.info('Add time log to screenshot');
      event.entity.timeLog = timeLog;
    }
  }
}
