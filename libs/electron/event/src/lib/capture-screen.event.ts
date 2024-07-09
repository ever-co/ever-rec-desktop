import { ScreenshotService } from '@prototype/electron/database';
import { FileManager, getWindowSize } from '@prototype/electron/utils';
import {
  Channel,
  IScreenshot,
  IScreenshotInput,
} from '@prototype/shared/utils';
import { desktopCapturer, ipcMain } from 'electron';

// Constants
const SCREENSHOT_DIR = 'screenshots';
const ENTIRE_SCREEN = 'Entire screen';
const DISPLAY_ID = '1';

export function captureScreenEvent(): void {
  let captureInterval: NodeJS.Timeout | null = null;

  ipcMain.on(Channel.START_CAPTURE_SCREEN, (event, interval) => {
    if (captureInterval) {
      clearInterval(captureInterval);
    }
    captureInterval = setInterval(async () => {
      const screenshot = await takeScreenshot();
      if (screenshot) {
        event.reply(Channel.SCREENSHOT_CAPTURED, screenshot);
      }
    }, interval);
  });

  ipcMain.on(Channel.STOP_CAPTURE_SCREEN, () => {
    if (captureInterval) {
      clearInterval(captureInterval);
      captureInterval = null;
    }
  });
}

async function takeScreenshot(): Promise<IScreenshot | null> {
  try {
    const [screenSource, windowSource] = await Promise.all([
      getScreenSource(),
      getWindowSource()
    ]);

    if (!screenSource) {
      console.warn('Screen source not found.');
      return null;
    }

    const screenshotBuffer = screenSource.thumbnail.toPNG();
    const fileName = `screenshot-${Date.now()}.png`;
    const screenshotPath = await FileManager.write(SCREENSHOT_DIR, fileName, screenshotBuffer);

    const screenshot: IScreenshotInput = {
      pathname: screenshotPath,
      metadata: {
        name: windowSource?.name || '',
        description: getWindowDescription(windowSource),
        icon: ''
      }
    };

    if (windowSource?.appIcon && !windowSource.appIcon.isEmpty()) {
      const iconBuffer = windowSource.appIcon.toPNG();
      const iconPath = await FileManager.write(SCREENSHOT_DIR, `icon-${fileName}`, iconBuffer);
      screenshot.metadata.icon = iconPath;
    }

    return ScreenshotService.save(screenshot);
  } catch (error) {
    console.error('Error taking screenshot:', error);
    return null;
  }
}

async function getScreenSource() {
  const sources = await desktopCapturer.getSources({
    types: ['screen'],
    thumbnailSize: getWindowSize(),
    fetchWindowIcons: false
  });

  return sources.find(source => source.name === ENTIRE_SCREEN && source.display_id === DISPLAY_ID);
}

async function getWindowSource() {
  const windows = await desktopCapturer.getSources({
    types: ['window'],
    thumbnailSize: getWindowSize(),
    fetchWindowIcons: true
  });

  return windows[0];
}

function getWindowDescription(windowSource: Electron.DesktopCapturerSource | undefined): string {
  return windowSource ? windowSource.name : '';
}
