import {
  PhotoService,
  ScreenshotService,
  VideoService,
} from '@ever-co/electron-database';
import {
  PhotoUploaderService,
  ScreenshotUploaderService,
  VideoUploaderService,
} from '@ever-co/electron-utils';
import {
  IUpload,
  IUploaderService,
  IUploaderServiceFactory,
  UploadType,
} from '@ever-co/shared-utils';

export class UploaderServiceFactory implements IUploaderServiceFactory {
  create(upload: IUpload): IUploaderService {
    switch (upload.type) {
      case UploadType.SCREENSHOT:
        return new ScreenshotUploaderService(new ScreenshotService());
      case UploadType.VIDEO:
        return new VideoUploaderService(new VideoService());
      case UploadType.PHOTO:
        return new PhotoUploaderService(new PhotoService());
      default:
        throw new Error('Invalid upload type');
    }
  }
}
