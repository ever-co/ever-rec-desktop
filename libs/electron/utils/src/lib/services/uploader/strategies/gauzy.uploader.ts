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

  public config(): IUploaderConfig & { timeSlotId: string } | null {
    const auth = this.gauzyService.getContext()?.auth;
    const timeSlotId = this.gauzyService.getContext()?.additionalSetting?.['timeSlotId'];

    if (!auth) {
      return null;
    }

    return {
      url: this.gauzyService.getUploadUrl(this.uploadType),
      tenantId: auth.tenantId || null,
      token: auth.token || null,
      organizationId: auth.organizationId || null,
      timeSlotId: timeSlotId || null
    };
  }
}
