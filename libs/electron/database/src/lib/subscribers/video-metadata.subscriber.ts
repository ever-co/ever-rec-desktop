import { ElectronLogger } from '@ever-co/electron-utils';
import {
  generateVideoName,
  ILoggable,
  ILogger,
  moment,
} from '@ever-co/shared-utils';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { VideoMetadata } from '../entities/video-metadata.entity';
import { TimeLogService } from '../services/time-log.service';

@EventSubscriber()
export class VideoMetadataSubscriber
  implements EntitySubscriberInterface<VideoMetadata>, ILoggable
{
  logger: ILogger = new ElectronLogger('Video metadata subscriber');
  timeLog = new TimeLogService();

  public listenTo() {
    return VideoMetadata;
  }

  public async beforeInsert(event: InsertEvent<VideoMetadata>): Promise<void> {
    this.logger.info('Prepare video metadata');
    if (!event.entity.name) {
      this.logger.info('Generate video name');
      const timeLog = await this.timeLog.running();
      event.entity.name = timeLog
        ? generateVideoName({
            start: timeLog.start,
            end: moment().toISOString(),
          })
        : generateVideoName();
    }
  }

  public async afterUpdate(): Promise<void> {
    this.logger.info('Video metadata updated');
  }

  public async afterRemove(): Promise<void> {
    this.logger.info('Video metadata deleted');
  }
}
