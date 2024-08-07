import { ScreenshotService, VideoService } from '@prototype/electron/database';
import { UploaderService } from '@prototype/electron/utils';
import { Channel, IUpload, UploadType } from '@prototype/shared/utils';
import { ipcMain } from 'electron';

export function uploadEventListener() {
  const uploadService = new UploaderService();
  ipcMain.on(Channel.UPLOAD, async (event, upload: IUpload) => {
    switch (upload.type) {
      case UploadType.SCREENSHOT:
        await uploadService.execute(event, upload, ScreenshotService);
        break;
      case UploadType.VIDEO:
        await uploadService.execute(event, upload, new VideoService());
        break;
      default:
        break;
    }
  });
}

export function removeUploadEvent(): void {
  ipcMain.removeAllListeners(Channel.UPLOAD);
}
