import { Repository } from 'typeorm';
import { appDataSource } from '../data-source';
import { IScreenshotUpload } from '@ever-co/shared-utils';
import { ScreenshotUpload } from '../entities/screenshot-upload.entity';

export class ScreenshotUploadRepository {
    private static _instance: Repository<IScreenshotUpload>;

    public static get instance(): Repository<IScreenshotUpload> {
        if (!this._instance) {
            this._instance = appDataSource.getRepository<IScreenshotUpload>(ScreenshotUpload);
        }
        return this._instance;
    }
}
