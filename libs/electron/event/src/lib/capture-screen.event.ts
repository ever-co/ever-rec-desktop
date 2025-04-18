import {
  ApplicationService,
  ScreenshotService,
  TimeLogService,
} from '@ever-co/electron-database';
import {
  ElectronLogger,
  FileManager,
  getWindowSize,
  TimerScheduler,
} from '@ever-co/electron-utils';
import {
  Channel,
  IScreenCaptureConfig,
  IScreenshot,
  IScreenshotInput,
  IScreenshotMetadata,
  moment,
  SCREENSHOT_DIR,
  SCREENSHOT_INTERVAL_DELAY,
  Source,
} from '@ever-co/shared-utils';
import { desktopCapturer, ipcMain, IpcMainEvent } from 'electron';
import { EventManager } from './event.manager';
import { GetScreenShotMetadataQuery } from './get-screenshot-metadata.query';

const logger = new ElectronLogger();
const metadataQuery = new GetScreenShotMetadataQuery();
const eventManager = EventManager.getInstance();
const timeLogService = new TimeLogService();
const screenshotService = new ScreenshotService();
const timerScheduler = TimerScheduler.getInstance();

export function captureScreenEvent(): void {
  ipcMain.on(Channel.START_CAPTURE_SCREEN, captureScreen);
}

export function captureScreen(
  event: IpcMainEvent,
  config: IScreenCaptureConfig
) {
  const { period = SCREENSHOT_INTERVAL_DELAY } = config || {};
  const delay = moment.duration(period, 'seconds').asSeconds();
  timeLogService.start();

  timerScheduler.onTick(async (seconds) => {
    if (seconds % delay === 0) {
      const screenshot = await takeScreenshot(config);
      if (screenshot) {
        eventManager.reply(Channel.SCREENSHOT_CAPTURED, screenshot);
      }
    }

    await timeLogService.updateDuration();

    event.sender.send(Channel.TICK);
  });

  timerScheduler.onStop(() => timeLogService.stop());

  timerScheduler.start();
}

async function takeScreenshot(
  config: IScreenCaptureConfig
): Promise<IScreenshot | null> {
  const { source: type = Source.SCREEN, captureAll = false } = config || {};
  try {
    const [sources, metadata] = await Promise.all([
      getSources(type),
      metadataQuery.execute(new ApplicationService()),
    ]);

    if (!metadata) {
      logger.error(`Screenshot metadata not found.`);
      return null;
    }

    if (!sources.length) {
      logger.warn(`${type} sources not found.`);
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

  return screenshotService.save(screenshotData);
}

async function getSources(source: Source) {
  return desktopCapturer.getSources({
    types: [source],
    thumbnailSize: getWindowSize(),
  });
}

export function removeCaptureScreenEvent(): void {
  const channels = [
    Channel.SCREENSHOT_CAPTURED,
    Channel.START_CAPTURE_SCREEN,
    Channel.STOP_CAPTURE_SCREEN,
    Channel.TICK,
  ];
  channels.forEach((channel) => ipcMain.removeAllListeners(channel));
}
