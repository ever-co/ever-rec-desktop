import { ElectronLogger } from '@ever-co/electron-utils';
import {
  ILoggable,
  ILogger,
} from '@ever-co/shared-utils';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { TimeLog } from '../entities/time-log.entity';
import { SessionService } from '../services/session.service';

@EventSubscriber()
export class TimeLogSubscriber
  implements EntitySubscriberInterface<TimeLog>, ILoggable {
  private readonly sessionService = new SessionService();
  readonly logger: ILogger = new ElectronLogger('Time log subscriber');

  public listenTo() {
    return TimeLog;
  }

  public async beforeInsert(event: InsertEvent<TimeLog>): Promise<void> {
    this.logger.info('Add session time log');
    event.entity.session = await this.sessionService.getActiveSession();
  }
}
