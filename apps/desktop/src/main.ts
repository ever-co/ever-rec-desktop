import { ElectronLogger } from '@ever-capture/electron-utils';
import { ILogger } from '@ever-capture/shared-utils';
import { app, BrowserWindow } from 'electron';
import log from 'electron-log/main';
import App from './app/app';
import ElectronEvents from './app/events/electron.events';
import SquirrelEvents from './app/events/squirrel.events';
import UpdateEvents from './app/events/update.events';

Object.assign(console, log.functions);

export default class Main {
  static initialize() {
    if (SquirrelEvents.handleEvents()) {
      // squirrel event handled (except first run event) and app will exit in 1000ms, so don't do anything else
      app.quit();
    }
  }

  static bootstrapApp() {
    App.main(app, BrowserWindow);
  }

  static bootstrapAppEvents() {
    ElectronEvents.bootstrapElectronEvents();

    // initialize auto updater service
    if (!App.isDevelopmentMode()) {
      UpdateEvents.initAutoUpdateService();
    }
  }

  static handleErrors() {
    const logger: ILogger = new ElectronLogger();

    process.on('uncaughtException', (error) => {
      logger.error(
        'Uncaught Exception:' + error.stack ??
          error.message ??
          JSON.stringify(error)
      );
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:' + promise + 'reason:' + reason);
    });
  }
}

// initialize logger
Main.handleErrors();

// handle setup events as quickly as possible
Main.initialize();

// bootstrap app
Main.bootstrapApp();
Main.bootstrapAppEvents();
