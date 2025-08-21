import { ElectronLogger } from '@ever-co/electron-utils';
import { ILogger } from '@ever-co/shared-utils';
import { app } from 'electron';
import log from 'electron-log/main';

import App from './app/app';
import ElectronEvents from './app/events/electron.events';
import SquirrelEvents from './app/events/squirrel.events';
import UpdateEvents from './app/events/update.events';
import { DeepLinkService } from './app/protocols/deeplink.service';

class Main {
  private static readonly logger: ILogger = new ElectronLogger();

  public static run(): void {
    if (this.isPrimaryInstance) {
      this.registerProtocol();
    }

    this.setupGlobalErrorHandlers();
    this.handleSquirrelStartup();
    this.patchConsoleInDevMode();

    this.bootstrapApp();
    this.bootstrapAppEvents();
  }

  private static patchConsoleInDevMode(): void {
    if (App.isDevelopmentMode()) {
      Object.assign(console, log.functions);
    }
  }

  private static handleSquirrelStartup(): void {
    if (SquirrelEvents.handleEvents()) {
      // Squirrel event handled; exit early
      app.quit();
    }
  }

  private static bootstrapApp(): void {
    if (!this.isPrimaryInstance) {
      app.quit();
      return;
    }

    app.on('second-instance', (_,argv) => {
      if (App.window) {
        App.window.show();
        App.window.restore();
        App.window.focus();
        DeepLinkService.handleDeepLink(argv)
      }
    });

    App.main(app);
  }

  private static bootstrapAppEvents(): void {
    ElectronEvents.bootstrapElectronEvents();

    if (!App.isDevelopmentMode()) {
      UpdateEvents.initAutoUpdateService();
    }

    DeepLinkService.init(app);
  }

  private static setupGlobalErrorHandlers(): void {
    process.on('uncaughtException', (error) => {
      this.logger.error(`Uncaught Exception: ${error.stack ?? error}`);
    });

    process.on('unhandledRejection', (reason, promise) => {
      this.logger.error(
        `Unhandled Rejection at: ${JSON.stringify(promise)}\nReason: ${reason}`
      );
    });
  }

  private static registerProtocol(): void {
    app.setAsDefaultProtocolClient(DeepLinkService.PROTOCOL);
    this.logger.info(`Protocol '${DeepLinkService.PROTOCOL}' registered.`);
  }

  public static get isPrimaryInstance(): boolean {
    return app.requestSingleInstanceLock();
  }
}

// Bootstrap application
Main.run();
