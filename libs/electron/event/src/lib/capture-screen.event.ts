import { FileManager, getWindowSize } from '@prototype/electron/utils';
import { channel } from '@prototype/shared/utils';
import { desktopCapturer, ipcMain } from 'electron';

export function captureScreenEvent(): void {
  let captureInterval: any;
  ipcMain.on(channel.START_CAPTURE_SCREEN, async (event, interval) => {
    if (captureInterval) {
      clearInterval(captureInterval);
    }
    captureInterval = setInterval(async () => {
      // Take screenshot
      const filePath = await takeScreenshot();
      // Send the screenshot back to the renderer process
      event.reply(channel.SCREENSHOT_CAPTURED, filePath);
    }, interval);
  });

  ipcMain.on(channel.STOP_CAPTURE_SCREEN, () => {
    clearInterval(captureInterval);
  });
}

// Function to take screenshot
async function takeScreenshot() {
  const sources = await desktopCapturer.getSources({
    types: ['screen'],
    thumbnailSize: getWindowSize(),
  });
  const screenSource = sources[0]; // Select the first screen

  const image = screenSource.thumbnail.toPNG();

  const fileDir = 'screenshots';

  const fileName = `screenshot-${Date.now()}.png`;

  return FileManager.write(fileDir, fileName, image);
}
