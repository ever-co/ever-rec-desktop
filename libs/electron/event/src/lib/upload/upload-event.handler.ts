import {
  Channel,
  IS3Config,
  IUpload,
  IUploaderServiceFactory,
  IUploadEventHandler,
} from '@ever-co/shared-utils';
import { UploaderServiceFactory } from './uploader-service.factory';
import { ipcMain } from 'electron';

export class UploadEventHandler implements IUploadEventHandler {
  private factory: IUploaderServiceFactory;

  constructor(factory: IUploaderServiceFactory = new UploaderServiceFactory()) {
    this.factory = factory;
  }

  private async handleUpload(
    event: Electron.IpcMainEvent,
    { upload, s3Config }: { s3Config: IS3Config; upload: IUpload }
  ) {
    try {
      const uploaderService = this.factory.create(upload);
      await uploaderService.execute(event, upload, s3Config);
    } catch (error) {
      console.error(error);
      event.reply(Channel.UPLOAD_ERROR, error);
    }
  }

  public register(): void {
    ipcMain.on(Channel.UPLOAD, this.handleUpload.bind(this));
  }

  public unregister(): void {
    [
      Channel.UPLOAD,
      Channel.UPLOAD_DONE,
      Channel.UPLOAD_ERROR,
      Channel.UPLOAD_CANCELED,
      Channel.UPLOAD_PROGRESS,
    ].forEach((channel) => {
      ipcMain.removeAllListeners(channel);
    });
  }
}
