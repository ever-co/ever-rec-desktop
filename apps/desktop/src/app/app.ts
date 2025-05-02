import { AppWindow } from '@ever-co/window';
import { desktopCapturer, screen, session } from 'electron';
import { join } from 'path';
import { environment } from '../environments/environment';
import { rendererAppName, rendererAppPort } from './constants';

export default class App {
  static window: AppWindow;
  static application: Electron.App;

  static main(app: Electron.App): void {
    App.application = app;
    App.application.setName('Ever Rec Desktop');

    App.application.on('ready', App.handleAppReady);
    App.application.on('activate', App.handleAppActivate);
    App.application.on('window-all-closed', App.handleAllWindowsClosed);
  }

  static isDevelopmentMode(): boolean {
    const envFlag = process.env.ELECTRON_IS_DEV;
    return envFlag !== undefined
      ? parseInt(envFlag, 10) === 1
      : !environment.production;
  }

  private static handleAllWindowsClosed(): void {
    if (process.platform !== 'darwin') {
      App.application.quit();
    }
  }

  private static async handleAppReady(): Promise<void> {
    if (!rendererAppName) return;

    const isDev = App.isDevelopmentMode();
    App.window = App.createMainWindow(isDev);
    App.handlePermission();
    App.handleMediaRequest();
    await App.window.onAppReady();
  }

  private static handlePermission(): void {
    session.defaultSession.setPermissionRequestHandler(
      (webContents, permission, callback) => {
        const allowedPermissions = ['media', 'microphone', 'camera'];
        if (allowedPermissions.includes(permission)) {
          callback(true); // Granted
        } else {
          callback(false); // Denied
        }
      }
    );
  }

  private static handleMediaRequest(): void {
    session.defaultSession.setDisplayMediaRequestHandler(
      (request, callback) => {
        desktopCapturer
          .getSources({ types: ['screen', 'window'] })
          .then((sources) => {
            // Grant access to the first screen found.
            callback({ video: sources[0], audio: 'loopback' });
          });
      },
      { useSystemPicker: true }
    );
  }

  private static async handleAppActivate(): Promise<void> {
    // Re-create window only if it was closed
    if (!App.window) {
      await App.handleAppReady();
    }
  }

  private static createMainWindow(isDev: boolean): AppWindow {
    const { width: screenW = 1280, height: screenH = 720 } =
      screen.getPrimaryDisplay()?.workAreaSize ?? {};

    const width = Math.min(1280, screenW);
    const height = Math.min(720, screenH);

    return new AppWindow({
      isDevelopmentMode: isDev,
      options: {
        width,
        height,
        webPreferences: {
          preload: join(__dirname, 'main.preload.js'),
          enableBlinkFeatures: 'EnumerateDevices, MediaDevices',
        },
      },
      loader: {
        hash: '/',
        port: rendererAppPort,
        path: join(__dirname, '..', rendererAppName, 'browser', 'index.html'),
        route: '/',
      },
    });
  }
}
