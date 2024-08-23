import {
  ScreenshotService,
  VideoService,
} from '@ever-capture/electron-database';
import { UploaderService } from '@ever-capture/electron-utils';
import { Channel, IUpload, UploadType } from '@ever-capture/shared-utils';
import { ipcMain, IpcMainEvent } from 'electron';

const uploadService = new UploaderService();

export function uploadEventListener() {
  ipcMain.on(Channel.UPLOAD, uploadVideo);
}

export async function uploadVideo(event: IpcMainEvent, upload: IUpload) {
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
}

export function removeUploadEvent(): void {
  ipcMain.removeAllListeners(Channel.UPLOAD);
}
