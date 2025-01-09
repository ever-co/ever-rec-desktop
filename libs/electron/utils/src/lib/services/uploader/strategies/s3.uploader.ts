import {
  IUploaderConfig,
  IUploaderStrategy,
} from '../models/uploader-strategy.interface';
import { S3Service } from '../../aws/s3.service';
import { IS3Config, UploadType } from '@ever-co/shared-utils';

export class S3UploaderStrategy implements IUploaderStrategy {
  private readonly s3Service: S3Service;

  constructor(
    readonly s3Config: IS3Config,
    private readonly uploadType: UploadType
  ) {
    this.s3Service = new S3Service(s3Config);
  }

  public async config(): Promise<IUploaderConfig | null> {
    const url = await this.s3Service.signedURL(this.uploadType);

    if (!url) {
      return null;
    }

    return {
      url,
      tenantId: null,
      token: null,
      organizationId: null,
    };
  }
}
