import { ScreenshotService } from '@prototype/electron/database';
import { FileManager, getWindowSize } from '@prototype/electron/utils';
import {
  Channel,
  IScreenshot,
  IScreenshotInput,
} from '@prototype/shared/utils';
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
      // If no screenshot don't reply to renderer
      if (!screenshot) return;
      // Send the screenshot back to the renderer process
      event.reply(Channel.SCREENSHOT_CAPTURED, screenshot);
    }, interval);
  });

  ipcMain.on(Channel.STOP_CAPTURE_SCREEN, () => {
    clearInterval(captureInterval);
  });
}

// Function to take screenshot
async function takeScreenshot(): Promise<IScreenshot | null> {
  try {
    const [sources, windows] = await Promise.all([
      desktopCapturer.getSources({
        types: ['screen'],
        thumbnailSize: getWindowSize(),
        fetchWindowIcons: false,
      }),
      desktopCapturer.getSources({
        types: ['window'],
        thumbnailSize: getWindowSize(),
        fetchWindowIcons: true,
      }),
    ]);

    const screenSource = sources.find(
      (source) => source.name === 'Entire screen' && source.display_id === '1'
    );

    if (!screenSource) {
      console.warn('Screen source not found.');
      return null;
    }

    const windowSource = windows[0];

    const taken: IScreenshotInput = {
      pathname: '',
      metadata: {
        name: windowSource?.name ?? '',
        description: windows
          .map((window) => window.name)
          .filter(Boolean)
          .join(' '),
        icon: '',
      },
    };

    const screenshotBuffer = screenSource.thumbnail.toPNG();
    const fileDir = 'screenshots';
    const fileName = `screenshot-${Date.now()}.png`;

    taken.pathname = await FileManager.write(
      fileDir,
      fileName,
      screenshotBuffer
    );

    if (windowSource?.appIcon && !windowSource.appIcon.isEmpty()) {
      const iconBuffer = windowSource.appIcon.toPNG();
      const icon = await FileManager.write(
        fileDir,
        `icon-${fileName}`,
        iconBuffer
      );
      taken.metadata.icon = icon;
    }

    return ScreenshotService.save(taken);
  } catch (error) {
    console.error('Error taking screenshot:', error);
    return null;
  }
}
