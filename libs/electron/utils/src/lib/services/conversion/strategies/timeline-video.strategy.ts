import {
  Channel,
  IConversionStrategy,
  ILogger,
  IScreenshotService,
  isEmpty,
  ITimelineService,
  IVideo,
  IVideoConfig,
  IVideoService,
} from '@ever-co/shared-utils';
import { ISplitterStrategy } from '../../../interfaces/splitter-strategy.interface';
import { FileManager } from '../../files/file-manager';
import { VideoConversionService } from '../../video-conversion.service';
import { WorkerFactory } from '../../worker-factory.service';
import { TimelineScreenshotSearch } from './helpers/timeline-screenshot.search';
import { TimelineVideoSearch } from './helpers/timeline-video.search';
import { ScreenshotConversionStrategy } from './screenshot-conversion.strategy';
import { VideoMergeStrategy } from './video-merge.strategy';

export class TimelineVideoStrategy implements IConversionStrategy {
  /**
   * @param timeLogId The ID of the time log to associate with the timeline video.
   * @param videoService The service to interact with the video database.
   * @param screenshotService The service to interact with the screenshot database.
   * @param timelineService The service to interact with the timeline database.
   * @param logger The logger to log messages.
   * @param config The video configuration settings.
   * @param splitter The strategy to split video files.
   */
  constructor(
    private timeLogId: string,
    private videoService: IVideoService,
    private screenshotService: IScreenshotService,
    private timelineService: ITimelineService,
    private logger: ILogger,
    private config: IVideoConfig,
    private splitter: ISplitterStrategy
  ) {}

  /**
   * Converts the timeline to a video.
   * Searches for existing videos associated with the timeline and merges them if found.
   * If no videos are found, it logs the absence and attempts to convert screenshots instead.
   *
   * @param event The ipcMainEvent that triggered the conversion.
   * @returns A promise that resolves when the conversion is completed.
   */
  public async execute(event: Electron.IpcMainEvent): Promise<void> {
    // Log the start of timeline video handling
    this.logger.info('Handling timeline video');

    // Initiate a search for videos associated with the timeline
    const videoSearch = new TimelineVideoSearch(
      this.videoService,
      this.timeLogId
    );

    // Attempt to find videos related to the timeline
    const [videos, count] = await videoSearch.execute();

    if (!count) {
      // Log and reply if no suitable video is found for the timeline
      this.logger.info(
        'No suitable video found, attempting screenshot conversion'
      );

      // Initiate a search for screenshots associated with the timeline
      const screenshotSearch = new TimelineScreenshotSearch(
        this.screenshotService,
        this.timeLogId,
        this.config
      );

      // Retrieve screenshots for conversion
      const screenshots = await screenshotSearch.execute();

      // Create a strategy to convert screenshots to video
      const screenshotStrategy = new ScreenshotConversionStrategy(
        screenshots,
        { ...this.config, timeLogId: this.timeLogId },
        this.logger,
        this.videoService,
        this.splitter,
        WorkerFactory,
        FileManager,
        this.timelineService,
        true
      );

      // Execute the screenshot conversion strategy
      await screenshotStrategy.execute(event);
    } else {
      // Handle the case where only one video is found
      if (videos.length === 1) {
        await this.handleOneVideo(videos[0]);
      }
      // Create a merge strategy for the found videos
      const mergeStrategy = new VideoMergeStrategy(
        videos,
        this.logger,
        FileManager,
        new VideoConversionService(
          event,
          [],
          { ...this.config, timeLogId: this.timeLogId },
          this.splitter,
          WorkerFactory,
          FileManager,
          Channel,
          this.logger,
          this.videoService,
          this.timelineService,
          true
        )
      );

      // Execute the merge strategy
      await mergeStrategy.execute(event);
    }
  }
  /**
   * Handles the case where only one video is found.
   * It logs the occurrence and saves the timeline associated with the video.
   *
   * @param video The video to handle.
   * @returns A promise that resolves when the operation is completed.
   */
  private async handleOneVideo(video: IVideo): Promise<void> {
    if (isEmpty(video)) return;

    const payload = {
      timeLogId: this.timeLogId,
      videoId: video.id,
    };

    const timeline = await this.timelineService.findOne({ where: payload });

    if (isEmpty(timeline)) {
      await this.timelineService.save(payload);
    }
  }
}
