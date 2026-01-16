import { IUpload, IS3Config, isObjectEmpty } from '@ever-co/shared-utils';
import { S3UploaderStrategy } from './strategies/s3.uploader';
import { GauzyUploaderStrategy } from './strategies/gauzy.uploader';
import { IUploaderStrategy } from './models/uploader-strategy.interface';
import { EverRecUploaderStrategy } from './strategies/ever-rec.uploader';

export class UploaderStrategyFactory {
  public create(upload: IUpload, s3Config?: IS3Config): IUploaderStrategy {
    if (s3Config && s3Config.enabled && !isObjectEmpty(s3Config)) {
      return new S3UploaderStrategy(s3Config, upload.type);
    }

    if (upload.token && upload.apiUrl) {
      return new EverRecUploaderStrategy(upload);
    }

    return new GauzyUploaderStrategy(upload.type);
  }
}
