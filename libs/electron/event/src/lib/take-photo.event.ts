import { TimerScheduler } from '@ever-co/electron-utils';
import { Channel, moment } from '@ever-co/shared-utils';
import {
  AppWindowId,
  IWindow,
  StreamWindow,
  WindowManager,
} from '@ever-co/window';
import { ipcMain, screen } from 'electron';

export function takePhotoEvent() {
  ipcMain.on(Channel.START_CAPTURE_SCREEN, takePhoto);
}

function takePhoto(): void {
  const scheduler = TimerScheduler.getInstance();
  const manager = WindowManager.getInstance();
  const delay = moment.duration(10, 'seconds').asSeconds();

  let main: IWindow | null = null;
  let stream: IWindow | null = null;

  scheduler.onStart(async () => {
    main = manager.getOne(AppWindowId.MAIN);
    stream = manager.getOne(AppWindowId.STREAMING);

    if (!main) return;

    const { workArea } = screen.getPrimaryDisplay();
    const padding = 20;
    const width = 256;
    const height = 144;

    stream =
      stream ||
      new StreamWindow({
        isDevelopmentMode: main.config.isDevelopmentMode,
        loader: {
          ...main.config.loader,
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
            preload: main.config.options?.webPreferences?.preload,
          },
        },
      });

    await stream.load();

    stream.show();

    stream.send(Channel.TAKE_PHOTO);
  });

  scheduler.onStop(() => {
    if (!stream) return;
    stream.send(Channel.TAKE_PHOTO);
    stream.close();
  });

  scheduler.onTick(async (seconds) => {
    if (!stream) return;
    if (seconds % delay === 0) stream.send(Channel.TAKE_PHOTO);
  });

  ipcMain.on(Channel.STOP_TRACKING, () => {
    if (!main) return;
    main.send(Channel.AUTO_STOP_SYNC);
  });
}
