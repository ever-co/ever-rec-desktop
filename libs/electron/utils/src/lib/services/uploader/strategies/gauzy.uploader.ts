import {
  IUploaderConfig,
  IUploaderStrategy,
} from '../models/uploader-strategy.interface';
import { GauzyService } from '../../gauzy/gauzy.service';

export class GauzyUploaderStrategy implements IUploaderStrategy {
  private readonly gauzyService: GauzyService;

  constructor() {
    this.gauzyService = new GauzyService();
  }

  public config(): IUploaderConfig | null {
    const auth = this.gauzyService.getContext()?.auth;

    if (!auth) {
      return null;
    }

    return {
      url: this.gauzyService.getUploadUrl(),
      tenantId: auth.tenantId || null,
      token: auth.token || null,
      organizationId: auth.organizationId || null,
    };
  }
}
