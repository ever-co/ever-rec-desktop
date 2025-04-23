import { app, Event } from 'electron';
import { Window } from '../shared/models/window.model';
import { IWindowConfig } from '../shared/interfaces/window-config.interface';
import { WindowManager } from './window.manager';
import { AppWindowId } from '@ever-co/shared-utils';

export class StreamWindow extends Window {
  private readonly manager = WindowManager.getInstance();
  private readonly windowId = AppWindowId.STREAMING;
  private isPlatformBindingsRegistered = false;

  constructor(config: IWindowConfig) {
    super(config);
    this.initializeStreamWindow();
    this.browserWindow?.webContents.toggleDevTools();
  }

  private initializeStreamWindow(): void {
    this.initalize();
    this.registerWithManager();
    this.applyPlatformSpecificBindings();
    this.enableAlwaysOnTop();
  }

  private registerWithManager(): void {
    this.manager.register(this.windowId, this);
  }

  private unregisterFromManager(): void {
    this.manager.unregister(this.windowId);
  }

  private applyPlatformSpecificBindings(): void {
    if (this.isPlatformBindingsRegistered) return;
    this.isPlatformBindingsRegistered = true;

    if (process.platform === 'darwin') {
      app.on('activate', () => this.focus());
    }

    const gracefulExit = () => this.handleGracefulExit();

    process.once('SIGINT', gracefulExit);
    process.once('SIGTERM', gracefulExit);
  }

  private handleGracefulExit(): void {
    if (!this._isAppExiting) {
      this.initiateGracefulExit();
    }
  }

  private enableAlwaysOnTop(): void {
    const win = this.browserWindow;
    if (!win) return;

    win.setVisibleOnAllWorkspaces(true, {
      visibleOnFullScreen: true,
      skipTransformProcessType: false,
    });
    win.setAlwaysOnTop(true, 'pop-up-menu', 2);
  }

  private disableAlwaysOnTop(): void {
    const win = this.browserWindow;
    if (!win) return;

    win.setVisibleOnAllWorkspaces(false);
    win.setAlwaysOnTop(false);
  }

  protected override async handleClose(event: Event): Promise<void> {
    if (this._isAppExiting) return;

    event.preventDefault();
    this.disableAlwaysOnTop();
    this.unregisterFromManager();
    this.browserWindow?.destroy();
  }
}
