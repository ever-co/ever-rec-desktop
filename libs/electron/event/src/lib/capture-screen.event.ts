import { channel } from '@prototype/shared/utils';
import { desktopCapturer, ipcMain, screen } from 'electron';

export function getWindowSize(): { height: number; width: number } {
  const display = screen.getPrimaryDisplay();
  return {
    height: display.workAreaSize.height,
    width: display.workAreaSize.width,
  };
}

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
