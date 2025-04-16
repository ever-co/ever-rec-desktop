import { TimerScheduler } from '@ever-co/electron-utils';
import { Channel, moment } from '@ever-co/shared-utils';
import {
  AppWindowId,
  IWindow,
  StreamWindow,
  WindowManager,
} from '@ever-co/window';
import { screen } from 'electron';

export function takePhotoEvent(): void {
  const scheduler = TimerScheduler.getInstance();
  const manager = WindowManager.getInstance();
  const delay = moment.duration(5, 'minutes').asSeconds();
  let stream: IWindow | null = null;

  scheduler.onStart(async () => {
    const main = manager.getOne(AppWindowId.MAIN);
    stream = manager.getOne(AppWindowId.STREAMING);

    if (!main) return;

    const { workArea } = screen.getPrimaryDisplay();
    const padding = 10;
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
}
