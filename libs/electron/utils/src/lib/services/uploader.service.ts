import {
  Channel,
  ILoggable,
  ILogger,
  IS3Config,
  IScreenshot,
  IUpload,
  IUploadableService,
  IUploadFile,
  IVideo
} from '@ever-co/shared-utils';
import { ipcMain } from 'electron';
import * as path from 'path';
import { In } from 'typeorm';
import { S3Service } from './aws/s3.service';
import { FileManager } from './files/file-manager';
import { ElectronLogger } from './logger/electron-logger';
import { WorkerFactory } from './worker-factory.service';

export class UploaderService implements ILoggable {
  readonly logger: ILogger = new ElectronLogger('Uploader Service');
  public async execute(
    event: Electron.IpcMainEvent,
    upload: IUpload,
    service: IUploadableService,
    s3Config: IS3Config
  ): Promise<void> {
    this.logger.info('Start uploading...');

    const s3Service = new S3Service(s3Config);

    const url = await s3Service.signedURL(upload.type);

    if (!url) {
      this.logger.error('Error getting signed URL');
      event.reply(Channel.UPLOAD_ERROR, 'Error getting signed URL');
      return;
    }

    const data = await service.findAll({
      where: { id: In(upload.ids) },
    });

    const files: IUploadFile[] = data.map((item: IScreenshot | IVideo) => ({
      pathname: FileManager.decodePath(item.pathname),
      key: upload.key,
    }));

    this.logger.info('Create upload worker...');

    const worker = WorkerFactory.createWorker(
      path.join(__dirname, 'assets', 'workers', 'upload.worker.js'),
      { files, url }
    );

    worker.on('message', (payload) => {
      switch (payload.status) {
        case 'done':
          this.logger.info('Done...');
          event.reply(Channel.UPLOAD_DONE, payload.message);
          break;
        case 'progress':
          this.logger.info('In Progress::' + payload.message);
          event.reply(Channel.UPLOAD_PROGRESS, payload.message);
          break;
        case 'error':
          this.logger.error('Error::' + payload.message);
          event.reply(Channel.UPLOAD_ERROR, payload.message);
          break;
        default:
          this.logger.warn('Unknown status');
          break;
      }
    });

    worker.on('error', (error) => {
      this.logger.error('Error::' + error);
      event.reply(Channel.UPLOAD_ERROR, {
        status: 'error',
        message: error.message || error,
      });
      worker.terminate();
    });

    worker.on('exit', (code) => {
      this.logger.error(`Worker exited with code ${code}`);
      worker.terminate();
    });

    ipcMain.on(Channel.UPLOAD_CANCELED, (event) => {
      worker.terminate();
      event.reply(Channel.UPLOAD_DONE);
      this.logger.error('Canceled...');
    });

    worker.postMessage({
      status: 'start',
    });
  }
}
