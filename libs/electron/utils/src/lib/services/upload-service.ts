import { ILoggable, ILogger } from '@ever-co/shared-utils';
import { ElectronLogger } from './logger/electron-logger';
import { IApplicationConfig, localStore } from '@gauzy/desktop-core';

export class UploadService implements ILoggable {
  public logger: ILogger = new ElectronLogger('Upload Service');
  /**
   * Retrieves the video upload URL based on the application configuration.
   * @returns {string | null} The full URL or `null` if configuration or serverUrl is unavailable.
   */
  public getUploadUrl(): string | null {
    try {
      const config = this.getContext()?.config;

      if (config?.serverUrl) {
        return `${config.serverUrl}/api/plugins/videos`;
      }
      this.logger.warn('Server URL is missing in the configuration.');
      return null;
    } catch (error) {
      this.logger.error('Failed to retrieve the upload URL:', error);
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
      this.logger.debug('Configuration context:', context);
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
