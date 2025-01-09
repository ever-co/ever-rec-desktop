import {
  Channel,
  ILoggable,
  ILogger,
  IS3Config,
  IUpload,
  IUploadableService,
  IVideo,
} from '@ever-co/shared-utils';
import { ipcMain } from 'electron';
import * as path from 'path';
import { In } from 'typeorm';
import { FileManager } from './files/file-manager';
import { ElectronLogger } from './logger/electron-logger';
import { WorkerFactory } from './worker-factory.service';
import { S3UploaderStrategy } from './uploader/strategies/s3.uploader';
import { ContextUploader } from './uploader/context-uploader';
import { GauzyUploaderStrategy } from './uploader/strategies/gauzy.uploader';
import { Worker } from 'worker_threads';

export class UploaderService implements ILoggable {
  readonly logger: ILogger = new ElectronLogger('Uploader Service');
  private readonly context = new ContextUploader(new GauzyUploaderStrategy());

  public async execute(
    event: Electron.IpcMainEvent,
    upload: IUpload,
    service: IUploadableService,
    s3Config: IS3Config
  ): Promise<void> {
    this.logger.info('Start uploading...');

    let config = this.context.strategy.config();

    if (!config && s3Config) {
      this.context.strategy = new S3UploaderStrategy(s3Config, upload.type);
      config = await this.context.strategy.config();

      if (!config) {
        this.logger.error('Error getting signed URL');
        event.reply(Channel.UPLOAD_ERROR, 'Error getting signed URL');
        return;
      }
    }

    const files = await this.prepareFiles(service, upload);

    this.logger.info('Create upload worker...');

    const worker = WorkerFactory.createWorker(
      path.join(__dirname, 'assets', 'workers', 'upload.worker.js'),
      { files, config }
    );

    this.workerHandler(worker, service, upload, event);
  }

  private async prepareFiles(service: IUploadableService, upload: IUpload) {
    const data = await service.findAll({
      where: { id: In(upload.ids) },
      relations: ['metadata'],
    });

    return data.map((item: IVideo) => ({
      title: item.metadata?.name,
      description: item.metadata?.summary,
      duration: item.metadata?.duration,
      recordedAt: item.metadata?.createdAt,
      size: item.metadata?.size,
      resolution: item.metadata?.resolution,
      codec: item.metadata?.codec,
      frameRate: item.metadata?.frameRate,
      pathname: FileManager.decodePath(item.pathname),
      key: upload.key,
    }));
  }

  private workerHandler(
    worker: Worker,
    service: IUploadableService,
    upload: IUpload,
    event: Electron.IpcMainEvent
  ) {
    worker.on('message', (payload) => {
      switch (payload.status) {
        case 'done':
          this.logger.info('Done...');
          upload.ids.forEach((id) => {
            service.update(id, { synced: true });
          });
          event.reply(Channel.UPLOAD_DONE, 'Uploaded successfully');
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
