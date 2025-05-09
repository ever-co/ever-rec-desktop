import { ILoggable, ILogger, UploadType } from '@ever-co/shared-utils';
import { ElectronLogger } from '../logger/electron-logger';
import { IApplicationConfig, localStore } from '@ever-gauzy/desktop-core';

export class GauzyService implements ILoggable {
  public logger: ILogger = new ElectronLogger('Upload Service');

  /**
   * Retrieves the video upload URL based on the application configuration.
   * @param {UploadType} uploadType - The type of upload to generate URL for
   * @returns {string | null} The full URL or `null` if configuration or serverUrl is unavailable
   */
  public getUploadUrl(uploadType: UploadType): string | null {
    try {
      const config = this.getContext()?.config;

      if (!config?.serverUrl) {
        this.logger.warn('Server URL is missing in the configuration');
        return null;
      }

      // Ensure the URL is properly formatted (remove trailing slashes)
      const baseUrl = config.serverUrl.replace(/\/+$/, '');
      return `${baseUrl}/api/plugins/${uploadType}`;
    } catch (error) {
      this.logger.error(
        'Failed to retrieve the upload URL',
        error instanceof Error ? error : new Error(String(error))
      );
      return null;
    }
  }

  /**
   * Fetches the application configuration context.
   * @returns {IApplicationConfig} The application configuration object.
   */
  public getContext(): IApplicationConfig | null {
    try {
      const context = localStore.find();
      if (!context) {
        this.logger.error('Configuration context is undefined.');
        return null;
      }
      return context;
    } catch (error) {
      this.logger.error('Failed to fetch configuration context:', error);
      return null;
    }
  }
}
