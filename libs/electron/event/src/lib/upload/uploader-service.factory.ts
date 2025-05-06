import { ScreenshotService, VideoService } from '@ever-co/electron-database';
import {
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
      default:
        throw new Error('Invalid upload type');
    }
  }
}
