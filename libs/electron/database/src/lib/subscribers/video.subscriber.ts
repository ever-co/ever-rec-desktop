import { ElectronLogger } from '@ever-co/electron-utils';
import { ILoggable, ILogger } from '@ever-co/shared-utils';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { Video } from '../entities/video.entity';
import { TimeLogService } from '../services/time-log.service';

@EventSubscriber()
export class VideoSubscriber
  implements EntitySubscriberInterface<Video>, ILoggable
{
  logger: ILogger = new ElectronLogger('Video subscriber');
  timeLog = new TimeLogService();

  public listenTo() {
    return Video;
  }

  public async beforeInsert(event: InsertEvent<Video>): Promise<void> {
    this.logger.info('Prepare video');
    const timeLog = await this.timeLog.running();
    if (timeLog) {
      this.logger.info('Add time log to video');
      event.entity.timeLog = timeLog;
    }
  }

  public async afterUpdate(event: UpdateEvent<Video>): Promise<void> {
    this.logger.info('Video updated');
  }

  public async afterRemove(event: RemoveEvent<Video>): Promise<void> {
    this.logger.info('Video deleted');
  }
}
