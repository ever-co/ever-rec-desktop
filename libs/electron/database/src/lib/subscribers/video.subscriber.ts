import { ElectronLogger } from '@ever-co/electron-utils';
import { ILoggable, ILogger } from '@ever-co/shared-utils';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  LoadEvent,
} from 'typeorm';
import { Video } from '../entities/video.entity';
import { TimeLogService } from '../services/time-log.service';
import { Timeline } from '../entities/timeline.entity';

@EventSubscriber()
export class VideoSubscriber
  implements EntitySubscriberInterface<Video>, ILoggable
{
  public readonly logger: ILogger = new ElectronLogger('Video subscriber');
  private readonly timeLogService = new TimeLogService();

  public listenTo() {
    return Video;
  }

  public async beforeInsert(event: InsertEvent<Video>): Promise<void> {
    this.logger.info('Prepare video');
    const timeLog = await this.timeLogService.running();
    if (timeLog) {
      this.logger.info('Add time log to video');
      event.entity.timeLog = timeLog;
    }
  }

  public async afterUpdate(): Promise<void> {
    this.logger.info('Video updated');
  }

  public async afterRemove(): Promise<void> {
    this.logger.info('Video deleted');
  }

  /**
   * AfterLoad event to calculate and set the isTimeline property.
   */
  public async afterLoad(
    entity: Video,
    event: LoadEvent<Video>
  ): Promise<void> {
    if (entity.timelines) {
      entity.isTimeline = entity.timelines.length > 0;
    } else {
      const repository = event.manager.getRepository(Timeline);
      const count = await repository.count({
        where: { videoId: entity.id },
      });

      entity.isTimeline = count > 0;
    }
  }
}
