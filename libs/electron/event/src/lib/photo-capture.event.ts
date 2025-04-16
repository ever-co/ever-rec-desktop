import { TimerScheduler } from '@ever-co/electron-utils';
import { Channel, moment } from '@ever-co/shared-utils';
import {
  AppWindowId,
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
  private streamWindow: IWindow | null = null;

  constructor(
    scheduler = TimerScheduler.getInstance(),
    windowManager = WindowManager.getInstance()
  ) {
    this.scheduler = scheduler;
    this.windowManager = windowManager;
    this.delayInSeconds = moment.duration(10, 'seconds').asSeconds();

    this.registerEvents();
    this.registerSchedulerEvents();
  }

  public registerSchedulerEvents(): void {
    this.scheduler.onStart(this.handleStart.bind(this));
    this.scheduler.onTick(this.handleTick.bind(this));
    this.scheduler.onStop(this.handleStop.bind(this));
  }

  private registerEvents(): void {
    ipcMain.on(Channel.START_TRACKING, () => this.createStreamingWindow());
    ipcMain.on(Channel.STOP_TRACKING, () => {
      if (this.mainWindow) {
        this.mainWindow.send(Channel.AUTO_STOP_SYNC);
      }
    });
  }

  private async createStreamingWindow(): Promise<void> {
    this.streamWindow = this.windowManager.getOne(AppWindowId.STREAMING);

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
          width,
          height,
          frame: false,
          resizable: false,
          x: padding,
          y: workArea.height - height - padding,
          webPreferences: {
            preload: this.mainWindow.config.options?.webPreferences?.preload,
          },
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
    if (this.streamWindow) {
      this.streamWindow.send(Channel.TAKE_PHOTO);
      this.streamWindow.close();
      this.streamWindow = null;
    }
  }

  private handleTick(seconds: number): void {
    if (this.streamWindow && seconds % this.delayInSeconds === 0) {
      this.streamWindow.send(Channel.TAKE_PHOTO);
    }
  }
}
