import { app, Event } from 'electron';
import { Window } from '../shared/models/window.model';
import { IWindowConfig } from '../shared/interfaces/window-config.interface';
import { AppWindowId } from '../shared/enums/app-window-id.enum';
import { WindowManager } from './window.manager';

export class StreamWindow extends Window {
  private readonly manager = WindowManager.getInstance();

  constructor(config: IWindowConfig) {
    super(config);
    this.bindAppEvents();
    this.initalize();
    this.manager.register(AppWindowId.STREAMING, this);
  }

  private bindAppEvents(): void {
    if (process.platform === 'darwin') {
      app.on('activate', () => this.focus());
    }

    process.on('SIGINT', () =>
      this._isAppExiting ? null : this.initiateGracefulExit()
    );
    process.on('SIGTERM', () =>
      this._isAppExiting ? null : this.initiateGracefulExit()
    );
  }

  protected async handleClose(event: Event): Promise<void> {
    if (this._isAppExiting) return;
    event.preventDefault();
    await this.initiateGracefulExit();
  }
}
