import { TimerScheduler } from '@ever-co/electron-utils';
import { Channel, moment, AppWindowId } from '@ever-co/shared-utils';
import {
  IWindow,
  IWindowManager,
  StreamWindow,
  WindowManager,
} from '@ever-co/window';
import { ipcMain, screen } from 'electron';

export class PhotoCaptureEvent {
  private readonly scheduler: TimerScheduler;
  private readonly windowManager: IWindowManager;
  private readonly delayInSeconds: number;

  private mainWindow: IWindow | null = null;
  private streamWindow: StreamWindow | null = null;

  constructor() {
    this.scheduler = TimerScheduler.getInstance();
    this.windowManager = WindowManager.getInstance();
    this.delayInSeconds = moment.duration(10, 'seconds').asSeconds();

    this.registerEvents();
    this.registerSchedulerEvents();
  }

  public registerSchedulerEvents(): void {
    this.scheduler.onStart(this.handleStart.bind(this));
    this.scheduler.onStop(this.handleStop.bind(this));
  }

  private registerEvents(): void {
    ipcMain.on(Channel.START_TRACKING, () => {
      this.createStreamingWindow();
      this.scheduler.onTick(this.handleTick.bind(this));
    });
    ipcMain.on(Channel.STOP_TRACKING, () => {
      this.handleStopTracking();
    });
  }

  private handleStopTracking(): void {
    if (!this.streamWindow) return;

    this.streamWindow.on('window::closed', () => {
      this.notifyAutoStopSync();
      this.streamWindow = null;
    });

    this.streamWindow.close();
  }

  private notifyAutoStopSync(): void {
    this.mainWindow?.send(Channel.AUTO_STOP_SYNC);
  }

  private async createStreamingWindow(): Promise<void> {
    this.streamWindow = this.windowManager.getOne(
      AppWindowId.STREAMING
    ) as StreamWindow;

    if (!this.mainWindow) {
      return;
    }

    if (!this.streamWindow) {
      const { workArea } = screen.getPrimaryDisplay();
      const padding = 20;
      const width = 256;
      const height = 144;

      this.streamWindow = new StreamWindow({
        isDevelopmentMode: this.mainWindow.config.isDevelopmentMode,
        loader: {
          ...this.mainWindow.config.loader,
          hash: '/webcam',
          route: '/#/webcam',
        },
        options: {
          ...this.mainWindow.config.options,
          width,
          height,
          frame: false,
          resizable: false,
          x: padding,
          y: workArea.height - height - padding,
        },
      });

      await this.streamWindow.load();
    }

    this.streamWindow.show();
    this.streamWindow.send(Channel.TAKE_PHOTO);
  }

  private handleStart(): void {
    this.mainWindow = this.windowManager.getOne(AppWindowId.MAIN);
    if (this.mainWindow) {
      this.mainWindow.send(Channel.REQUEST_TRACKING);
    }
  }

  private handleStop(): void {
    if (this.validateStreamWindow()) {
      this.streamWindow?.send(Channel.TAKE_PHOTO);
    }
  }

  private validateStreamWindow(): boolean {
    if (!this.streamWindow) {
      return false;
    }

    if (this.streamWindow && this.streamWindow.isDestroyed()) {
      this.streamWindow = null;
      return false;
    }

    return true;
  }

  private handleTick(seconds: number): void {
    if (this.validateStreamWindow() && seconds % this.delayInSeconds === 0) {
      this.streamWindow?.send(Channel.TAKE_PHOTO);
    }
  }
}

export function removePhotoCaptureEvent(): void {
  [
    Channel.TAKE_PHOTO,
    Channel.START_TRACKING,
    Channel.STOP_TRACKING,
    Channel.REQUEST_TRACKING,
  ].forEach((channel) => ipcMain.removeAllListeners(channel));
}
