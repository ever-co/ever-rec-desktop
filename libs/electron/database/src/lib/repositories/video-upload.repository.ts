import { Repository } from 'typeorm';
import { appDataSource } from '../data-source';
import { IVideoUpload } from '@ever-co/shared-utils';
import { VideoUpload } from '../entities/video-upload.entity';

export class VideoUploadRepository {
    private static _instance: Repository<IVideoUpload>;

    public static get instance(): Repository<IVideoUpload> {
        if (!this._instance) {
            this._instance = appDataSource.getRepository<IVideoUpload>(VideoUpload);
        }
        return this._instance;
    }
}
