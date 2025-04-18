import { BrowserWindow, Event, app } from 'electron';
import { EventEmitter } from 'events';
import { IWindowConfig } from '../interfaces/window-config.interface';
import { WindowLoaderContext } from './window-loader-context.model';
import { WindowOptionsBuilder } from './window-options-builder.model';
import { IWindow } from '../interfaces/window.interface';
import { Channel } from '@ever-co/shared-utils';

export abstract class Window extends EventEmitter implements IWindow {
  protected _browserWindow: BrowserWindow | null;
  protected loaderContext: WindowLoaderContext;
  protected _shouldHideOnClose = true;
  protected _isWindowHidden = false;
  protected _isAppExiting = false;

  constructor(readonly config: IWindowConfig) {
    super();
    this._browserWindow = null;
    this.loaderContext = new WindowLoaderContext(this.config);
  }

  protected initalize() {
    const builder = new WindowOptionsBuilder(this.config.isDevelopmentMode);
    const options = builder.build(this.config.options);
    this._browserWindow = new BrowserWindow(options);

    this.bindWindowEvents();
    this.emit('window-created');
  }

  protected bindWindowEvents(): void {
    const window = this.browserWindow;
    if (!window) return;

    window.on('closed', () => (this._browserWindow = null));
    this.once('did-finish-load', () => this.emitWebContentsReady());

    window.on('close', (event) => this.handleClose(event));
    window.on('hide', () => {
      this._shouldHideOnClose = false;
      this._isWindowHidden = true;
    });
    window.on('show', () => {
      this._shouldHideOnClose = true;
      this._isWindowHidden = false;
    });
    window.on('restore', () => this.show());
    window.once('ready-to-show', () => this.show());
  }

  protected abstract handleClose(event: Event): void;

  protected emitWebContentsReady(): void {
    const window = this._browserWindow;
    if (window) this.emit('webcontents-ready', window.webContents);
  }

  public async load(): Promise<void> {
    const window = this.browserWindow;
    if (!window) return;

    const url = this.loaderContext.url();
    await window.loadURL(url);
    this.emit('did-finish-load');
  }

  public show(): void {
    this.browserWindow?.show();
  }

  public hide(): void {
    this.browserWindow?.hide();
  }

  public close(): void {
    if (!this.browserWindow) return;
    this.hide();
    this.browserWindow.close();
  }

  public minimize(): void {
    this.browserWindow?.minimize();
  }

  public maximize(): void {
    this.browserWindow?.maximize();
  }

  public restore(): void {
    this.browserWindow?.restore();
  }

  public focus(): void {
    const window = this.browserWindow;
    if (!window) return;

    window.show();
    this._isWindowHidden = false;
    this.setSkipTaskbar(false);
    window.restore();
    window.focus();
  }

  public setSkipTaskbar(skip: boolean): void {
    this.browserWindow?.setSkipTaskbar(skip);
  }

  public isMinimized(): boolean {
    const window = this.browserWindow;
    return !window || window.isMinimized() || this._isWindowHidden;
  }

  public get isAppExiting(): boolean {
    return this._isAppExiting;
  }

  public requestHide(): void {
    if (!this.browserWindow) return;

    this.setSkipTaskbar(true);
    this.hide();
    this._isWindowHidden = true;
  }

  public requestClose(): void {
    if (!this._browserWindow) return;
    this.initiateGracefulExit();
  }

  public requestMinimize(): void {
    this.browserWindow?.minimize();
  }

  public async initiateGracefulExit(): Promise<void> {
    if (this._isAppExiting) {
      this._shouldHideOnClose = false;
      process.exit();
    }

    this._isAppExiting = true;
    this._shouldHideOnClose = false;

    this.emit('exit-requested');
    app.exit(0);
  }

  public get browserWindow(): BrowserWindow | undefined {
    const win = this._browserWindow;
    return win && !win.isDestroyed() ? win : undefined;
  }

  public send(channel: Channel, ...args: any[]): void {
    const window = this.browserWindow;
    if (window) window.webContents.send(channel, ...args);
  }
}
