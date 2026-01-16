import { IDeepLinkHandler, ILogger } from '@ever-co/shared-utils';
import { ElectronLogger } from '@ever-co/electron-utils';
import { EventEmitter } from 'node:events';
import { GoogleAuthHandler } from './handlers/google-auth.handler';

export const deepLinkEventEmitter = new EventEmitter();

export class DeepLinkService {
  private static readonly logger: ILogger = new ElectronLogger();
  private static readonly handlers: IDeepLinkHandler[] = [
    new GoogleAuthHandler(),
  ];
  public static readonly PROTOCOL = 'ever-rec';

  /**
   * Initializes the deep link service and sets up the protocol handlers.
   * This handles macOS 'open-url' events.
   */
  public static init(electronApp: Electron.App): void {
    electronApp.on('open-url', (event, url) => {
      event.preventDefault();
      this.handleDeepLink([url]);
    });
    this.logger.info('DeepLinkService initialized.');
  }

  /**
   * Parses the provided arguments to find and handle a deep link URL.
   * This is used for Windows and Linux instances.
   */
  public static handleDeepLink(argv: string[]): void {
    this.logger.info(`Attempting to handle deep link from argv: ${argv}`);
    const deepLinkUrl = this.findDeepLinkInArgs(argv);
    if (deepLinkUrl) {
      this.logger.info(`Found deep link: ${deepLinkUrl}`);
      try {
        const url = new URL(deepLinkUrl);
        this.dispatchDeepLink(url);
      } catch (error) {
        this.logger.error(
          `Failed to parse deep link URL: ${deepLinkUrl}`,
          error,
        );
      }
    } else {
      this.logger.info('No deep link found in arguments.');
    }
  }

  /**
   * Dispatches the deep link URL to the registered handlers.
   * This implements the Command/Strategy pattern.
   */
  private static dispatchDeepLink(url: URL): void {
    let handlerFound = false;
    for (const handler of this.handlers) {
      if (handler.canHandle(url)) {
        this.logger.info(`Found handler for deep link: ${url.href}`);
        handler.handle(url);
        handlerFound = true;
        break; // Stop after the first matching handler
      }
    }

    if (!handlerFound) {
      this.logger.warn(`No handler found for deep link: ${url.href}`);
    }

    // You can also emit a generic event for broader app-level handling
    deepLinkEventEmitter.emit('deep-link', url);
  }

  /**
   * Helper function to find the deep link URL in the command-line arguments.
   */
  private static findDeepLinkInArgs(argv: string[]): string | null {
    // On Windows and Linux, the deep link is one of the command-line arguments.
    // It is often the second argument after the executable path.
    const deepLink = argv.find((arg) => arg.startsWith(`${this.PROTOCOL}://`));
    return deepLink || null;
  }
}
