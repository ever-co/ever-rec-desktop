import { ScreenshotService, VideoService } from '@ever-co/electron-database';
import { UploaderService } from '@ever-co/electron-utils';
import { Channel, IS3Config, IUpload, UploadType } from '@ever-co/shared-utils';
import { ipcMain, IpcMainEvent } from 'electron';

const uploadService = new UploaderService();

export function uploadEventListener() {
  ipcMain.on(Channel.UPLOAD, uploadVideo);
}

export async function uploadVideo(
  event: IpcMainEvent,
  {
    upload,
    s3Config,
  }: {
    s3Config: IS3Config;
    upload: IUpload;
  }
) {
  try {
    switch (upload.type) {
      case UploadType.SCREENSHOT:
        await uploadService.execute(event, upload, ScreenshotService, s3Config);
        break;
      case UploadType.VIDEO:
        await uploadService.execute(
          event,
          upload,
          new VideoService(),
          s3Config
        );
        break;
      default:
        break;
    }
  } catch (error) {
    console.error(error);
    event.reply(Channel.UPLOAD_ERROR, error);
  }
}

export function removeUploadEvent(): void {
  ipcMain.removeAllListeners(Channel.UPLOAD);
}
