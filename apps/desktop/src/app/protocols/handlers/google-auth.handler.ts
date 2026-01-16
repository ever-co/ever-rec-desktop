import { IDeepLinkHandler, ILogger, Channel } from '@ever-co/shared-utils';
import { ElectronLogger } from '@ever-co/electron-utils';
import App from '../../app';

export class GoogleAuthHandler implements IDeepLinkHandler {
  private readonly logger: ILogger = new ElectronLogger();

  public canHandle(url: URL): boolean {
    return url.protocol === 'ever-rec:' && url.href.includes('/oauth');
  }

  public handle(url: URL): void {
    this.logger.info(`Handling deep link to google: ${url.href}`);
    const parsedUrl = this.parseOAuth(url);
    this.logger.info('Google auth data', parsedUrl);
    App.window.send(Channel.GOOGLE_AUTH_LOGIN, parsedUrl);
  }

  private parseOAuth(url: URL) {
    const params = url.searchParams;
    return {
      credential: params.get('id_token'),
    };
  }
}
