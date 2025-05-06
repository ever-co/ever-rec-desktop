import {
  AudioService,
  PhotoService,
  ScreenshotService,
  VideoService,
} from '@ever-co/electron-database';
import {
  AudioUploaderService,
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
      case UploadType.AUDIO:
        return new AudioUploaderService(new AudioService());
      default:
        throw new Error('Invalid upload type');
    }
  }
}
