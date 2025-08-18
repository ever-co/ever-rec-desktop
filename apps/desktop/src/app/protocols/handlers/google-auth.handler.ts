import { IDeepLinkHandler, ILogger } from '@ever-co/shared-utils';
import { ElectronLogger } from '@ever-co/electron-utils';

export class GoogleAuthHandler implements IDeepLinkHandler {
  private readonly logger: ILogger = new ElectronLogger();

  public canHandle(url: URL): boolean {
    return url.href.includes('/oauth');
  }

  public handle(url: URL): void {
    this.logger.info(`Handling deep link to google: ${url.href}`);
  }
}
