/**
 * This module is responsible on handling all the inter process communications
 * between the frontend to the electron backend.
 */

import { captureScreenEvent } from '@prototype/electron/events';
import { app, ipcMain } from 'electron';
import { environment } from '../../environments/environment';

export default class ElectronEvents {
  static bootstrapElectronEvents(): Electron.IpcMain {
    return ipcMain;
  }
}

ipcMain.removeAllListeners();

/* Set unlimited listeners */
ipcMain.setMaxListeners(0);

// Retrieve app version
ipcMain.handle('get-app-version', (event) => {
  console.log(`Fetching application version... [v${environment.version}]`);

  return environment.version;
});

// Handle App termination
ipcMain.on('quit', (event, code) => {
  app.exit(code);
});

captureScreenEvent();
