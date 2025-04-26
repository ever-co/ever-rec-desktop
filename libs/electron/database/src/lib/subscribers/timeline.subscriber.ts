import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  IsNull,
} from 'typeorm';
import { Timeline } from '../entities/timeline.entity';
import { ILoggable, isEmpty } from '@ever-co/shared-utils';
import { ElectronLogger } from '@ever-co/electron-utils';
import { Audio } from '../entities/audio.entity';

@EventSubscriber()
export class TimelineSubscriber
  implements EntitySubscriberInterface<Timeline>, ILoggable
{
  readonly logger = new ElectronLogger('TimelineSubscriber');

  public listenTo() {
    return Timeline;
  }

  public async afterInsert(event: InsertEvent<Timeline>): Promise<void> {
    const audio = await event.manager.findOne(Audio, {
      where: {
        parent: IsNull(),
        videoId: IsNull(),
        timeLogId: event.entity.timeLogId,
      },
    });

    if (isEmpty(audio)) {
      return this.logger.debug('No audio found');
    }

    audio.videoId = event.entity.videoId;
    await event.manager.save(audio);
  }
}
