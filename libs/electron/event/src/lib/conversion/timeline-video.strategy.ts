import {
  FileManager,
  ISplitterStrategy,
  VideoConversionService,
  WorkerFactory,
} from '@ever-co/electron-utils';
import {
  Channel,
  IConversionStrategy,
  ILogger,
  ITimelineService,
  IVideoConfig,
  IVideoService,
} from '@ever-co/shared-utils';
import { TimelineVideoSearch } from './timeline-video.search';
import { VideoMergeStrategy } from './video-merge.strategy';

export class TimelineVideoStrategy implements IConversionStrategy {
/**
 * @param timeLogId The ID of the time log to associate with the timeline video.
 * @param videoService The service to interact with the video database.
 * @param timelineService The service to interact with the timeline database.
 * @param logger The logger to log messages.
 * @param config The video configuration settings.
 * @param splitter The strategy to split video files.
 */
  constructor(
    private timeLogId: string,
    private videoService: IVideoService,
    private timelineService: ITimelineService,
    private logger: ILogger,
    private config: IVideoConfig,
    private splitter: ISplitterStrategy
  ) {}

  /**
   * Converts the timeline to a video.
   * Searches for existing videos associated with the timeline and merges them if found.
   * If no videos are found, it logs the absence and replies with a cancellation message.
   *
   * @param event The ipcMainEvent that triggered the conversion.
   * @returns A promise that resolves when the conversion is completed.
   */
  public async execute(event: Electron.IpcMainEvent): Promise<void> {
    // Log the start of timeline video handling
    this.logger.info('Handling timeline video');

    // Initiate a search for videos associated with the timeline
    const search = new TimelineVideoSearch(this.videoService, this.timeLogId);

    // Attempt to find videos related to the timeline
    const [videos, count] = await search.tryFindVideo();

    if (!count) {
      // Log and reply if no suitable video is found for the timeline
      this.logger.info('No suitable video found for the timeline');
      event.reply(Channel.CANCEL_CONVERSION, 'Timeline video not found');
    } else {
      // Create a merge strategy for the found videos
      const mergeStrategy = new VideoMergeStrategy(
        videos,
        this.logger,
        FileManager,
        true,
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
          this.timelineService
        )
      );
      // Execute the merge strategy
      await mergeStrategy.execute(event);
    }
  }
}
