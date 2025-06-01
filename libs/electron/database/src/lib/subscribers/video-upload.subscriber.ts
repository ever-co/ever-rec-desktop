import { ElectronLogger } from '@ever-co/electron-utils';
import { ILoggable, ILogger, moment } from '@ever-co/shared-utils';
import { EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm';
import { VideoUpload } from '../entities/video-upload.entity';

@EventSubscriber()
export class VideoUploadSubscriber implements EntitySubscriberInterface<VideoUpload>, ILoggable {
    logger: ILogger = new ElectronLogger('VideoUploadSubscriber');

    public listenTo() {
        return VideoUpload;
    }

    public beforeInsert(event: InsertEvent<VideoUpload>): void {
        if (!event.entity.uploadedAt) {
            this.logger.info('Setting uploadedAt for VideoUpload');
            event.entity.uploadedAt = moment().toISOString();
        }
    }
}
