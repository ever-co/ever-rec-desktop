import { ElectronLogger } from '@ever-co/electron-utils';
import { ILoggable, ILogger, moment } from '@ever-co/shared-utils';
import { EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm';
import { PhotoUpload } from '../entities/photo-upload.entity';

@EventSubscriber()
export class PhotoUploadSubscriber implements EntitySubscriberInterface<PhotoUpload>, ILoggable {
    logger: ILogger = new ElectronLogger('PhotoUploadSubscriber');

    public listenTo() {
        return PhotoUpload;
    }

    public beforeInsert(event: InsertEvent<PhotoUpload>): void {
        if (!event.entity.uploadedAt) {
            this.logger.info('Setting uploadedAt for PhotoUpload');
            event.entity.uploadedAt = moment().toISOString();
        }
    }
}
