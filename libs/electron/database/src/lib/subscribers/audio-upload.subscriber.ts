import { ElectronLogger } from '@ever-co/electron-utils';
import { ILoggable, ILogger, moment } from '@ever-co/shared-utils';
import { EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm';
import { AudioUpload } from '../entities/audio-upload.entity';

@EventSubscriber()
export class AudioUploadSubscriber implements EntitySubscriberInterface<AudioUpload>, ILoggable {
    logger: ILogger = new ElectronLogger('AudioUploadSubscriber');

    public listenTo() {
        return AudioUpload;
    }

    public beforeInsert(event: InsertEvent<AudioUpload>): void {
        if (!event.entity.uploadedAt) {
            this.logger.info('Setting uploadedAt for AudioUpload');
            event.entity.uploadedAt = moment().toISOString();
        }
    }
}
