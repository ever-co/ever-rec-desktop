import { getWindowSize } from '@prototype/electron/utils';
import { channel } from '@prototype/shared/utils';
import { desktopCapturer, ipcMain } from 'electron';

export function captureScreenEvent(): void {
  let captureInterval: any;
  ipcMain.on(channel.START_CAPTURE_SCREEN, async (event, interval) => {
    if (captureInterval) {
      clearInterval(captureInterval);
    }
    captureInterval = setInterval(async () => {
      const sources = await desktopCapturer.getSources({
        types: ['screen'],
        thumbnailSize: getWindowSize(),
      });
      const source = sources[0];
      const image = source.thumbnail;
      // Send the screenshot back to the renderer process
      event.reply(channel.SCREENSHOT_CAPTURED, image.toDataURL());
    }, interval);
  });

  ipcMain.on(channel.STOP_CAPTURE_SCREEN, () => {
    clearInterval(captureInterval);
  });
}
