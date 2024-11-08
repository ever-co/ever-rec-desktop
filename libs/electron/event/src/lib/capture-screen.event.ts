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
  IScreenshotMetadata,
  moment,
  SCREENSHOT_INTERVAL_DELAY,
  Source,
} from '@ever-co/shared-utils';
import { desktopCapturer, ipcMain, IpcMainEvent } from 'electron';
import { EventManager } from './event.manager';
import { GetScreenShotMetadataQuery } from './get-screenshot-metadata.query';

// Constants
export const SCREENSHOT_DIR = 'screenshots';
const logger = new ElectronLogger();
const metadataQuery = new GetScreenShotMetadataQuery();
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
    const screenshot = await takeScreenshot(config);
    if (screenshot) {
      eventManager.reply(Channel.SCREENSHOT_CAPTURED, screenshot);
    }
  }, moment.duration(config.period * 1000 || SCREENSHOT_INTERVAL_DELAY, 'seconds').asMilliseconds());
}

export async function stopCaptureScreen() {
  if (captureInterval) {
    clearInterval(captureInterval);
    captureInterval = null;
    await timeLogService.stop();
  }
}

async function takeScreenshot(
  config: IScreenCaptureConfig
): Promise<IScreenshot | null> {
  const { source: sourceType = Source.SCREEN, captureAll = false } =
    config || {};
  try {
    const sources = await (sourceType === Source.SCREEN
      ? getScreenSource()
      : getWindowSource());

    const metadata = await metadataQuery.execute();

    if (!metadata) {
      logger.error(`Screenshot metadata not found.`);
      return null;
    }

    if (!sources.length) {
      logger.warn(
        `${
          sourceType === Source.SCREEN ? 'Screen' : 'Window'
        } sources not found.`
      );
      return null;
    }

    if (captureAll) {
      const screenshotPromises = sources
        .map((source) => createScreenshot(source, metadata))
        .filter((screenshot) => !!screenshot);
      const [screenshot] = await Promise.all(screenshotPromises);

      return screenshot;
    } else {
      return createScreenshot(sources[0], metadata);
    }
  } catch (error) {
    logger.error(`Error taking screenshot: ${error}`);
    return null;
  }
}

async function createScreenshot(
  source: Electron.DesktopCapturerSource,
  metadata: Omit<IScreenshotMetadata, 'id'>
): Promise<IScreenshot | null> {
  const imageBuffer = source.thumbnail.toPNG();
  const imageName = `screenshot-${Date.now()}.png`;

  if (!imageBuffer) {
    return null;
  }

  const imagePath = await FileManager.write(
    SCREENSHOT_DIR,
    imageName,
    imageBuffer
  );

  if (!imagePath) {
    return null;
  }

  const imageSize = await FileManager.fileSize(imagePath);

  if (!imageSize) {
    return null;
  }

  const screenshotData: IScreenshotInput = {
    pathname: imagePath,
    metadata: {
      ...metadata,
      size: imageSize,
    },
  };

  return ScreenshotService.save(screenshotData);
}

async function getScreenSource() {
  return desktopCapturer.getSources({
    types: [Source.SCREEN],
    thumbnailSize: getWindowSize(),
  });
}

async function getWindowSource() {
  return desktopCapturer.getSources({
    types: [Source.WINDOW],
    thumbnailSize: getWindowSize(),
  });
}

export function removeCaptureScreenEvent(): void {
  const channels = [
    Channel.SCREENSHOT_CAPTURED,
    Channel.START_CAPTURE_SCREEN,
    Channel.STOP_CAPTURE_SCREEN,
  ];
  channels.forEach((channel) => ipcMain.removeAllListeners(channel));
}
