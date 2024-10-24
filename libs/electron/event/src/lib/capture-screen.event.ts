import { ScreenshotService, TimeLogService } from '@ever-co/electron-database';
import {
  ElectronLogger,
  FileManager,
  getWindowSize,
} from '@ever-co/electron-utils';
import {
  Channel,
  IScreenCaptureConfig,
  IScreenshot,
  IScreenshotInput,
  SCREENSHOT_INTERVAL_DELAY,
  Source,
} from '@ever-co/shared-utils';
import { desktopCapturer, ipcMain, IpcMainEvent } from 'electron';
import { EventManager } from './event.manager';

// Constants
const SCREENSHOT_DIR = 'screenshots';
const logger = new ElectronLogger();
const eventManager = EventManager.getInstance();
let captureInterval: NodeJS.Timeout | null = null;
const timeLogService = new TimeLogService();

export function captureScreenEvent(): void {
  ipcMain.on(Channel.START_CAPTURE_SCREEN, captureScreen);

  ipcMain.on(Channel.STOP_CAPTURE_SCREEN, stopCaptureScreen);
}

export function captureScreen(
  event: IpcMainEvent,
  config: IScreenCaptureConfig
) {
  if (captureInterval) {
    clearInterval(captureInterval);
  }
  timeLogService.start();
  captureInterval = setInterval(async () => {
    const screenshot = await takeScreenshot(config.source);
    if (screenshot) {
      eventManager.reply(Channel.SCREENSHOT_CAPTURED, screenshot);
    }
  }, config.period * 1000 || SCREENSHOT_INTERVAL_DELAY);
}

export async function stopCaptureScreen() {
  if (captureInterval) {
    clearInterval(captureInterval);
    captureInterval = null;
    await timeLogService.stop();
  }
}

async function takeScreenshot(
  sourceType = Source.SCREEN
): Promise<IScreenshot | null> {
  try {
    const [screenSource, windowSource] = await Promise.all([
      getScreenSource(),
      getWindowSource(),
    ]);

    if (!screenSource && sourceType === Source.SCREEN) {
      logger.warn('Screen source not found.');
      return null;
    }

    if (!windowSource && sourceType === Source.WINDOW) {
      logger.warn('Screen source not found.');
      return null;
    }

    const source = sourceType === Source.SCREEN ? screenSource : windowSource;

    const screenshotBuffer = source.thumbnail.toPNG();
    const fileName = `screenshot-${Date.now()}.png`;
    const screenshotPath = await FileManager.write(
      SCREENSHOT_DIR,
      fileName,
      screenshotBuffer
    );

    const size = await FileManager.fileSize(screenshotPath);

    if (!size) {
      return null;
    }

    const screenshot: IScreenshotInput = {
      pathname: screenshotPath,
      metadata: {
        name: windowSource?.name || '',
        description: getWindowDescription(windowSource),
        icon: '',
        size,
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
    types: [Source.SCREEN],
    thumbnailSize: getWindowSize(),
    fetchWindowIcons: false,
  });

  return sources[0];
}

async function getWindowSource() {
  const windows = await desktopCapturer.getSources({
    types: [Source.WINDOW],
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
