import { ElectronLogger } from '@ever-co/electron-utils';
import { ILoggable, ILogger } from '@ever-co/shared-utils';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { TimeLogService } from '../services/time-log.service';
import { Audio } from '../entities/audio.entity';

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
    this.logger.info('Prepare audio...');
    const timeLog = await this.timeLog.running();

    if (timeLog) {
      this.logger.info('Add time log to audio');
      event.entity.timeLog = timeLog;
    }
  }
}
