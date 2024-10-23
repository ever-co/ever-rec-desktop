import { ElectronLogger } from '@ever-co/electron-utils';
import { ILoggable, ILogger } from '@ever-co/shared-utils';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { Video } from '../entities/video.entity';

@EventSubscriber()
export class VideoSubscriber
  implements EntitySubscriberInterface<Video>, ILoggable
{
  logger: ILogger = new ElectronLogger();

  public listenTo() {
    return Video;
  }

  public async afterUpdate(event: UpdateEvent<Video>): Promise<void> {
    this.logger.info('Video updated');
  }

  public async afterRemove(event: RemoveEvent<Video>): Promise<void> {
    this.logger.info('Video deleted');
  }
}
