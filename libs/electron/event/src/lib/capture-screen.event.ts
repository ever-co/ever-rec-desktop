import { channel } from '@prototype/shared/utils';
import { BrowserWindow, ipcMain } from 'electron';

export function captureScreenEvent(): void {
  ipcMain.on(channel.CAPTURE_SCREEN, async (event, delay) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (!window) {
      console.debug('[captureScreenEvent]: No window');
      return;
    }
    setTimeout(() => {
      window.webContents.capturePage().then((image) => {
        // Send the screenshot back to the renderer process
        event.reply(channel.SCREENSHOT_CAPTURED, image.toDataURL());
      });
    }, delay);
  });
}
