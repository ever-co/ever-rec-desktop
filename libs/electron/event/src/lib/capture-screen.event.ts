import { ScreenshotService } from '@prototype/electron/database';
import { FileManager, getWindowSize } from '@prototype/electron/utils';
import { Channel, IScreenshot } from '@prototype/shared/utils';
import { desktopCapturer, ipcMain } from 'electron';

export function captureScreenEvent(): void {
  let captureInterval: any;
  ipcMain.on(Channel.START_CAPTURE_SCREEN, async (event, interval) => {
    if (captureInterval) {
      clearInterval(captureInterval);
    }
    captureInterval = setInterval(async () => {
      // Take screenshot
      const screenshot = await takeScreenshot();
      // Send the screenshot back to the renderer process
      event.reply(Channel.SCREENSHOT_CAPTURED, screenshot);
    }, interval);
  });

  ipcMain.on(Channel.STOP_CAPTURE_SCREEN, () => {
    clearInterval(captureInterval);
  });
}

// Function to take screenshot
async function takeScreenshot(): Promise<IScreenshot> {
  const sources = await desktopCapturer.getSources({
    types: ['screen'],
    thumbnailSize: getWindowSize(),
  });
  const screenSource = sources[0]; // Select the first screen

  const image = screenSource.thumbnail.toPNG();

  const fileDir = 'screenshots';

  const fileName = `screenshot-${Date.now()}.png`;

  const pathname = await FileManager.write(fileDir, fileName, image);

  return ScreenshotService.save(pathname);
}
