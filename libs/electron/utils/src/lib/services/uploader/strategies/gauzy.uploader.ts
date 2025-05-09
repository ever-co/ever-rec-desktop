import {
  IUploaderConfig,
  IUploaderStrategy,
} from '../models/uploader-strategy.interface';
import { GauzyService } from '../../gauzy/gauzy.service';
import { UploadType } from '@ever-co/shared-utils';

export class GauzyUploaderStrategy implements IUploaderStrategy {
  private readonly gauzyService: GauzyService;

  constructor(private readonly uploadType: UploadType) {
    this.gauzyService = new GauzyService();
  }

  public config(): IUploaderConfig | null {
    const auth = this.gauzyService.getContext()?.auth;

    if (!auth) {
      return null;
    }

    return {
      url: this.gauzyService.getUploadUrl(this.uploadType),
      tenantId: auth.tenantId || null,
      token: auth.token || null,
      organizationId: auth.organizationId || null,
    };
  }
}
