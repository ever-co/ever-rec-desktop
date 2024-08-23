import { ScreenshotService } from '@ever-capture/electron-database';
import {
  ElectronLogger,
  FileManager,
  getWindowSize,
} from '@ever-capture/electron-utils';
import {
  Channel,
  IScreenshot,
  IScreenshotInput,
  SCREENSHOT_INTERVAL_DELAY,
} from '@ever-capture/shared-utils';
import { desktopCapturer, ipcMain, IpcMainEvent } from 'electron';

// Constants
const SCREENSHOT_DIR = 'screenshots';
const logger = new ElectronLogger();
let captureInterval: NodeJS.Timeout | null = null;

export function captureScreenEvent(): void {
  ipcMain.on(Channel.START_CAPTURE_SCREEN, captureScreen);

  ipcMain.on(Channel.STOP_CAPTURE_SCREEN, stopCaptureScreen);
}

export function captureScreen(event: IpcMainEvent, interval: number) {
  if (captureInterval) {
    clearInterval(captureInterval);
  }
  captureInterval = setInterval(async () => {
    const screenshot = await takeScreenshot();
    if (screenshot) {
      event.reply(Channel.SCREENSHOT_CAPTURED, screenshot);
    }
  }, interval || SCREENSHOT_INTERVAL_DELAY);
}

export function stopCaptureScreen() {
  if (captureInterval) {
    clearInterval(captureInterval);
    captureInterval = null;
  }
}

async function takeScreenshot(): Promise<IScreenshot | null> {
  try {
    const [screenSource, windowSource] = await Promise.all([
      getScreenSource(),
      getWindowSource(),
    ]);

    if (!screenSource) {
      logger.warn('Screen source not found.');
      return null;
    }

    const screenshotBuffer = screenSource.thumbnail.toPNG();
    const fileName = `screenshot-${Date.now()}.png`;
    const screenshotPath = await FileManager.write(
      SCREENSHOT_DIR,
      fileName,
      screenshotBuffer
    );

    const screenshot: IScreenshotInput = {
      pathname: screenshotPath,
      metadata: {
        name: windowSource?.name || '',
        description: getWindowDescription(windowSource),
        icon: '',
      },
    };

    if (windowSource?.appIcon && !windowSource.appIcon.isEmpty()) {
      const iconBuffer = windowSource.appIcon.toPNG();
      const iconPath = await FileManager.write(
        SCREENSHOT_DIR,
        `icon-${fileName}`,
        iconBuffer
      );
      screenshot.metadata.icon = iconPath;
    }

    return ScreenshotService.save(screenshot);
  } catch (error) {
    logger.error('Error taking screenshot:' + error);
    return null;
  }
}

async function getScreenSource() {
  const sources = await desktopCapturer.getSources({
    types: ['screen'],
    thumbnailSize: getWindowSize(),
    fetchWindowIcons: false,
  });

  return sources[0];
}

async function getWindowSource() {
  const windows = await desktopCapturer.getSources({
    types: ['window'],
    thumbnailSize: getWindowSize(),
    fetchWindowIcons: true,
  });

  return windows[0];
}

function getWindowDescription(
  windowSource: Electron.DesktopCapturerSource | undefined
): string {
  return windowSource ? windowSource.name : '';
}

export function removeCaptureScreenEvent(): void {
  const channels = [
    Channel.SCREENSHOT_CAPTURED,
    Channel.START_CAPTURE_SCREEN,
    Channel.STOP_CAPTURE_SCREEN,
  ];
  channels.forEach((channel) => ipcMain.removeAllListeners(channel));
}
