import { Repository } from 'typeorm';
import { appDataSource } from '../data-source';
import { IAudioUpload } from '@ever-co/shared-utils';
import { AudioUpload } from '../entities/audio-upload.entity';

export class AudioUploadRepository {
    private static _instance: Repository<IAudioUpload>;

    public static get instance(): Repository<IAudioUpload> {
        if (!this._instance) {
            this._instance = appDataSource.getRepository<IAudioUpload>(AudioUpload);
        }
        return this._instance;
    }
}
