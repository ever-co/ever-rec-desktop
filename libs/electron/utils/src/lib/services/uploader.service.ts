import {
  Channel,
  ILoggable,
  ILogger,
  IScreenshot,
  IUpload,
  IUploadFile,
} from '@ever-capture/shared-utils';
import { ipcMain } from 'electron';
import * as path from 'path';
import { FindManyOptions, In } from 'typeorm';
import { FileManager } from './files/file-manager';
import { ElectronLogger } from './logger/electron-logger';
import { WorkerFactory } from './worker-factory.service';

interface IService {
  findAll(criteria: FindManyOptions): Promise<IScreenshot[]>;
}

export class UploaderService implements ILoggable {
  readonly logger: ILogger = new ElectronLogger();
  public async execute<T extends IService>(
    event: Electron.IpcMainEvent,
    upload: IUpload,
    service: T
  ): Promise<void> {
    this.logger.info('[upload] start uploading...');
    const screenshots = await service.findAll({
      where: { id: In(upload.ids) },
    });

    const files: IUploadFile[] = screenshots.map((screenshot: IScreenshot) => ({
      pathname: FileManager.decodePath(screenshot.pathname),
      key: upload.key,
    }));

    this.logger.info('[upload] create upload worker...');

    const worker = WorkerFactory.createWorker(
      path.join(__dirname, 'assets', 'workers', 'upload.worker.js'),
      { files, url: upload.url }
    );

    worker.on('message', (payload) => {
      switch (payload.status) {
        case 'done':
          this.logger.info('[upload] Done...');
          event.reply(Channel.UPLOAD_DONE, payload);
          break;
        case 'progress':
          this.logger.info('[upload] In Progress::' + payload.message);
          event.reply(Channel.UPLOAD_PROGRESS, payload);
          break;
        case 'error':
          this.logger.error('[upload] Error::' + payload.message);
          event.reply(Channel.UPLOAD_ERROR, payload);
          break;
        default:
          this.logger.warn('[upload] Unknown status');
          break;
      }
    });

    worker.on('error', (error) => {
      this.logger.error('[upload] Error::' + error);
      event.reply(Channel.UPLOAD_ERROR, { status: 'error', message: error });
      worker.terminate();
    });

    worker.on('exit', (code) => {
      this.logger.error(`[upload] Worker exited with code ${code}`);
      worker.terminate();
    });

    ipcMain.on(Channel.UPLOAD_CANCELED, (event) => {
      worker.terminate();
      event.reply(Channel.UPLOAD_DONE);
      this.logger.error('[upload] Canceled...');
    });
  }
}
