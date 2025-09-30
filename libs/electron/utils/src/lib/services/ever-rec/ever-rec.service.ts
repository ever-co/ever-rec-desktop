import { ILoggable, ILogger, IUpload, UploadType } from '@ever-co/shared-utils';
import { ElectronLogger } from '../logger/electron-logger';

export type EverRecConfig = Pick<IUpload, 'apiUrl' | 'type'>;

/**
 * Service for generating upload URLs for EverRec.
 * Encapsulates configuration handling and logging.
 */
export class EverRecService implements ILoggable {
  public readonly logger: ILogger;

  private static readonly DEFAULT_PATH = 'upload/file';

  constructor(logger: ILogger = new ElectronLogger(EverRecService.name)) {
    this.logger = logger;
  }

  /**
   * Retrieves the EverRec upload URL based on the configured API URL.
   * @param config - Configuration with apiUrl and uploadType.
   * @returns The full URL or `null` if configuration is invalid.
   */
  public getUploadUrl(config?: EverRecConfig): string | null {
    const effectiveConfig: EverRecConfig = {
      apiUrl: config?.apiUrl ?? process.env['apiUrl'],
      type: config?.type ?? UploadType.SCREENSHOT,
    };

    if (!effectiveConfig.apiUrl) {
      this.logger.warn('Missing `apiUrl` in configuration.');
      return null;
    }

    const uploadTypeCategoryMap: Record<UploadType, string> = {
      [UploadType.VIDEO]: 'video',
      [UploadType.SCREENSHOT]: 'image',
      [UploadType.PHOTO]: 'camshots',
      [UploadType.AUDIO]: 'soundshots',
    };

    try {
      return new URL(
        `api/v1/${uploadTypeCategoryMap[effectiveConfig.type]}/${EverRecService.DEFAULT_PATH}`,
        effectiveConfig.apiUrl,
      ).toString();
    } catch (error) {
      this.logger.error(
        `Failed to construct the upload URL for apiUrl: ${effectiveConfig.apiUrl}`,
        error instanceof Error ? error : new Error(String(error)),
      );
      return null;
    }
  }
}
