import { ElectronLogger } from '@ever-capture/electron/utils';
import { ILoggable, ILogger } from '@ever-capture/shared/utils';
import {
    EntitySubscriberInterface,
    EventSubscriber,
    RemoveEvent,
    UpdateEvent,
} from 'typeorm';
import { Screenshot } from '../entities/screenshot.entity';

@EventSubscriber()
export class ScreenshotSubscriber
  implements EntitySubscriberInterface<Screenshot>, ILoggable
{
  logger: ILogger = new ElectronLogger();

  public listenTo() {
    return Screenshot;
  }

  public async afterUpdate(event: UpdateEvent<Screenshot>): Promise<void> {
    this.logger.info('Entity updated');
  }

  public async afterRemove(event: RemoveEvent<Screenshot>): Promise<void> {
    this.logger.info('Entity deleted');
  }
}
