import { ElectronLogger } from '@ever-co/electron-utils';
import { ILogger } from '@ever-co/shared-utils';
import { app } from 'electron';
import log from 'electron-log/main';

import App from './app/app';
import ElectronEvents from './app/events/electron.events';
import SquirrelEvents from './app/events/squirrel.events';
import UpdateEvents from './app/events/update.events';

class Main {
  private static readonly logger: ILogger = new ElectronLogger();

  public static run(): void {
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
    if (!app.requestSingleInstanceLock()) {
      app.quit();
      return;
    }

    app.on('second-instance', () => {
      if (App.window) {
        App.window.show();
        App.window.restore();
        App.window.focus();
      }
    });

    App.main(app);
  }

  private static bootstrapAppEvents(): void {
    ElectronEvents.bootstrapElectronEvents();

    if (!App.isDevelopmentMode()) {
      UpdateEvents.initAutoUpdateService();
    }
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
}

// Bootstrap application
Main.run();
