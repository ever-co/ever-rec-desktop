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

  public afterUpdate(event: UpdateEvent<Screenshot>): void {
    FileManager.deleteFile(this.screenshot.pathname);
  }

  public afterRemove(event: RemoveEvent<Screenshot>): void {
    if (event.entity.pathname) {
      FileManager.deleteFile(event.entity.pathname);
    } else {
      FileManager.removeAllFiles('screenshots');
    }
  }
}
