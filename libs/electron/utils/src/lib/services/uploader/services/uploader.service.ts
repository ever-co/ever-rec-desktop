import {
  Channel,
  ILoggable,
  ILogger,
  IS3Config,
  isEmpty,
  IUpload,
  IUploadableService,
  IUploadDone,
  IUploaderService,
  moment,
} from '@ever-co/shared-utils';
import { ipcMain } from 'electron';
import * as path from 'path';

import { Worker } from 'worker_threads';
import { ElectronLogger } from '../../logger/electron-logger';
import { WorkerFactory } from '../../worker-factory.service';
import { ContextUploader } from '../context-uploader';
import { GauzyUploaderStrategy } from '../strategies/gauzy.uploader';
import { S3UploaderStrategy } from '../strategies/s3.uploader';
import { UploadError } from '../models/upload-error.model';

export abstract class UploaderService<T>
  implements IUploaderService, ILoggable {
  readonly logger: ILogger = new ElectronLogger('Uploader Service');

  protected readonly context = new ContextUploader();

  protected constructor(protected readonly service: IUploadableService<T>) { }

  public async execute(
    event: Electron.IpcMainEvent,
    upload: IUpload,
    s3Config: IS3Config,
  ): Promise<void> {
    try {
      this.logger.info('Start uploading...');

      this.context.strategy = new GauzyUploaderStrategy(upload.type);

      let config = await this.loadConfig();
      if (isEmpty(config) && s3Config) {
        this.context.strategy = new S3UploaderStrategy(s3Config, upload.type);
        config = await this.loadConfig();

        if (isEmpty(config)) {
          this.logger.error('Error getting signed URL');
          const uploadError = new UploadError('Error getting signed URL', upload.ids[0]);
          event.reply(Channel.UPLOAD_ERROR, uploadError.clone());
          return;
        }
      }

      if (isEmpty(config)) {
        this.logger.info('We cannot proceed with the upload');
        const uploadError = new UploadError('We cannot proceed with the upload', upload.ids[0]);
        event.reply(Channel.UPLOAD_ERROR, uploadError.clone());
        return;
      }

      const files = await this.prepareFiles(upload);

      this.logger.info('Create upload worker...');

      const worker = WorkerFactory.createWorker(
        path.join(__dirname, 'assets', 'workers', 'upload.worker'),
        { files, config },
      );

      this.workerHandler(worker, upload, event);
    } catch (error: any) {
      this.logger.error('Error uploading file', error);
      const uploadError = new UploadError(error ?? 'Error uploading file', upload.ids[0]);
      event.reply(Channel.UPLOAD_ERROR, uploadError.clone());
    }
  }

  protected abstract prepareFiles(upload: IUpload): Promise<any>;

  protected abstract synchronize(data: IUploadDone): Promise<void>;

  /**
   * Converts a given date input to an ISO 8601 string format.
   *
   * @param date - The date to convert, can be a Date object, string, or number.
   * @returns The ISO string representation of the date.
   */
  protected toISOString(date: Date | string | number | undefined) {
    if (!date) {
      date = new Date();
    }
    return moment(date).toISOString();
  }


  protected loadConfig() {
    return this.context.strategy.config();
  }

  protected getTimeSlotId() {
    if (this.context.strategy instanceof GauzyUploaderStrategy) {
      return this.context.strategy.config()?.timeSlotId;
    }
    return null;
  }

  private workerHandler(
    worker: Worker,
    upload: IUpload,
    event: Electron.IpcMainEvent,
  ) {
    worker.on('message', (payload) => {
      switch (payload.status) {
        case 'done':
          this.logger.info('Done...');
          this.synchronize(payload.message);
          event.reply(Channel.UPLOAD_DONE, payload.message);
          worker.terminate();
          break;
        case 'progress':
          this.logger.info('In Progress::' + JSON.stringify(payload.message));
          event.reply(Channel.UPLOAD_PROGRESS, payload.message);
          break;
        case 'error':
          this.logger.error('Error::' + JSON.stringify(payload.message));
          event.reply(Channel.UPLOAD_ERROR, payload.message);
          worker.terminate();
          break;
        default:
          this.logger.warn('Unknown status');
          break;
      }
    });

    worker.on('error', (error) => {
      this.logger.error('Error::' + error);
      const uploadError = new UploadError('Error uploading file', upload.ids[0]);
      event.reply(Channel.UPLOAD_ERROR, uploadError.clone());
      worker.terminate();
    });

    worker.on('exit', (code) => {
      this.logger.error(`Worker exited with code ${code}`);
      worker.terminate();
    });

    ipcMain.on(Channel.UPLOAD_CANCELED, (event, { itemId }) => {
      if (upload.ids.includes(itemId)) {
        worker.terminate();
        event.reply(Channel.UPLOAD_DONE, { itemId });
        this.logger.error('Canceled...');
      }
    });

    worker.postMessage({
      status: 'start',
    });
  }
}
