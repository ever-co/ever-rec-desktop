import { Repository } from 'typeorm';
import { appDataSource } from '../data-source';
import { IPhotoUpload } from '@ever-co/shared-utils';
import { PhotoUpload } from '../entities/photo-upload.entity';

export class PhotoUploadRepository {
    private static _instance: Repository<IPhotoUpload>;

    public static get instance(): Repository<IPhotoUpload> {
        if (!this._instance) {
            this._instance = appDataSource.getRepository<IPhotoUpload>(PhotoUpload);
        }
        return this._instance;
    }
}
