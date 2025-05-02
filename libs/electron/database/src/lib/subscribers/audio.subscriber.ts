import { ElectronLogger } from '@ever-co/electron-utils';
import { ILoggable, ILogger, isEmpty } from '@ever-co/shared-utils';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  IsNull,
  Not,
} from 'typeorm';
import { Audio } from '../entities/audio.entity';
import { TimeLogService } from '../services/time-log.service';

@EventSubscriber()
export class AudioSubscriber
  implements EntitySubscriberInterface<Audio>, ILoggable
{
  logger: ILogger = new ElectronLogger('AudioSubscriber');
  timeLog = new TimeLogService();

  public listenTo() {
    return Audio;
  }

  public async beforeInsert(event: InsertEvent<Audio>): Promise<void> {
    if (isEmpty(event.entity)) return;
    this.logger.info('Prepare audio...');
    const timeLog = await this.timeLog.running();

    if (timeLog) {
      event.entity.timeLog = timeLog;
    }
  }

  public async afterInsert(event: InsertEvent<Audio>): Promise<void> {
    if (isEmpty(event.entity)) return;
    this.logger.info('Prepare audio...');
    const timeLog = await this.timeLog.findLatest();
    this.logger.debug('Time log', timeLog);

    if (!isEmpty(timeLog) && isEmpty(event.entity.videoId)) {
      const chunks = await event.manager.find(Audio, {
        where: {
          id: Not(event.entity.id),
          timeLogId: timeLog.id,
          parent: IsNull(),
        },
      });
      if (isEmpty(chunks)) {
        this.logger.debug('No chunks found');
      } else {
        for (const chunk of chunks) {
          chunk.parent = event.entity;
        }
        if (!timeLog.running) {
          event.entity.timeLogId = timeLog.id;
          await event.manager.save(event.entity);
        }
        await event.manager.save(chunks);
      }
    }
  }
}
