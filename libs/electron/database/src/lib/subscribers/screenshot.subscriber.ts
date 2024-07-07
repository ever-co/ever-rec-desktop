import { FileManager } from '@prototype/electron/utils';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { Screenshot } from '../entities/screenshot.entity';

@EventSubscriber()
export class ScreenshotSubscriber
  implements EntitySubscriberInterface<Screenshot>
{
  screenshot: Screenshot;

  public listenTo() {
    return Screenshot;
  }

  public async afterUpdate(event: UpdateEvent<Screenshot>): Promise<void> {
    await FileManager.deleteFile(this.screenshot.pathname);
  }

  public async afterRemove(event: RemoveEvent<Screenshot>): Promise<void> {
    if (event?.entity?.pathname) {
      await FileManager.deleteFile(event.entity.pathname);
    }
  }
}
