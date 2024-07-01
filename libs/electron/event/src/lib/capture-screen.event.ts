import { getWindowSize } from '@prototype/electron/utils';
import { channel } from '@prototype/shared/utils';
import { desktopCapturer, ipcMain } from 'electron';

export function captureScreenEvent(): void {
  ipcMain.on(channel.CAPTURE_SCREEN, async (event, delay) => {
    setTimeout(async () => {
      const sources = await desktopCapturer.getSources({
        types: ['screen'],
        thumbnailSize: getWindowSize(),
      });
      const source = sources[0];
      const image = source.thumbnail;
      // Send the screenshot back to the renderer process
      event.reply(channel.SCREENSHOT_CAPTURED, image.toDataURL());
    }, delay);
  });
}
