import { bootstrapDatabase } from '@ever-co/electron-database';
import { Event, shell } from 'electron';
import { IWindowConfig } from '../shared/interfaces/window-config.interface';
import { Window } from '../shared/models/window.model';
import { WindowManager } from './window.manager';
import { AppWindowId } from '@ever-co/shared-utils';
import { isDevMode } from '@angular/core';

export class AppWindow extends Window {
  private readonly manager = WindowManager.getInstance();

  constructor(config: IWindowConfig) {
    super(config);
    this.registerProcessEvents();
    this.manager.register(AppWindowId.MAIN, this);
  }

  /**
   * Handle graceful termination via CLI (SIGINT, SIGTERM)
   */
  private registerProcessEvents(): void {
    process.on('SIGINT', () => {
      if (!this._isAppExiting) this.initiateGracefulExit();
    });

    process.on('SIGTERM', () => {
      if (!this._isAppExiting) this.initiateGracefulExit();
    });
  }

  /**
   * Override of the base window close handler
   */
  protected override async handleClose(event: Event): Promise<void> {
    if (this._isAppExiting) return;

    event.preventDefault();

    if (this._shouldHideOnClose || !this.config.isDevelopmentMode) {
      this.hide();
      this.setSkipTaskbar(true);
    } else {
      await this.initiateGracefulExit();
    }
  }

  protected override emitWebContentsReady(): void {
    this.registerRedirectHandler();
    super.emitWebContentsReady();
  }

  /**
   * Triggered when the Electron app is ready
   */
  public async onAppReady(): Promise<void> {
    this.initalize();
    await bootstrapDatabase();
    await this.load();
  }

  /**
   * macOS-style behavior for app reactivation from the dock
   */
  public async onAppActivate(): Promise<void> {
    if (this.browserWindow === null) {
      await this.onAppReady();
    }
  }

  protected registerRedirectHandler(): void {
    const contents = this.browserWindow?.webContents;
    if (!contents) return;

    contents.setWindowOpenHandler(({ url }) => {
      this.handleExternalRedirect(url);
      return { action: 'deny' }; // Prevent new Electron window
    });

    contents.on('will-navigate', (event, url) => {
      const currentUrl = contents.getURL();
      if (url !== currentUrl) {
        event.preventDefault();
        this.handleExternalRedirect(url);
      }
    });
  }

  protected handleExternalRedirect(url: string): void {
    // Optional allowlist for internal URLs
    const allowedHosts = ['localhost', '127.0.0.1']; // customize for plugins too
    const parsed = new URL(url);
    if (!allowedHosts.includes(parsed.hostname)) {
      shell.openExternal(url);
    }
  }
}
