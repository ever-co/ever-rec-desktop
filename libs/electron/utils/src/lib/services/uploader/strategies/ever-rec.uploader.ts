import { IUpload } from '@ever-co/shared-utils';
import { EverRecService } from '../../ever-rec/ever-rec.service';
import {
  IUploaderConfig,
  IUploaderStrategy,
} from '../models/uploader-strategy.interface';

export class EverRecUploaderStrategy implements IUploaderStrategy {
  private readonly everRecService: EverRecService;

  constructor(private readonly upload?: IUpload) {
    this.everRecService = new EverRecService();
  }

  public config(): IUploaderConfig | null {
    const url = this.everRecService.getUploadUrl(this.upload);

    if (!url || !this.upload?.token) {
      return null;
    }

    return {
      url,
      token: this.upload.token,
      refreshToken: this.upload.refreshToken,
      organizationId: null,
      tenantId: null,
    };
  }
}
