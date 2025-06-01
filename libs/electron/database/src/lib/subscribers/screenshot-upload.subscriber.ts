import { ElectronLogger } from '@ever-co/electron-utils';
import { ILoggable, ILogger, moment } from '@ever-co/shared-utils';
import { EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm';
import { ScreenshotUpload } from '../entities/screenshot-upload.entity';

@EventSubscriber()
export class ScreenshotUploadSubscriber implements EntitySubscriberInterface<ScreenshotUpload>, ILoggable {
    logger: ILogger = new ElectronLogger('ScreenshotUploadSubscriber');

    public listenTo() {
        return ScreenshotUpload;
    }

    public beforeInsert(event: InsertEvent<ScreenshotUpload>): void {
        if (!event.entity.uploadedAt) {
            this.logger.info('Setting uploadedAt for ScreenshotUpload');
            event.entity.uploadedAt = moment().toISOString();
        }
    }
}
