import {
  Channel,
  IBatchVideo,
  IConversionStrategy,
  ILogger,
  IVideo,
} from '@ever-co/shared-utils';
import { FileManager } from '../../files/file-manager';
import { VideoConversionService } from '../../video-conversion.service';

export class VideoMergeStrategy implements IConversionStrategy {
  /**
   * @param videos The list of videos to merge together.
   * @param logger The logger to write messages to.
   * @param isTimeline Whether the video is a timeline video or not.
   * @param videoConversionService The video conversion service to use to merge the videos.
   */
  constructor(
    private readonly videos: IVideo[],
    private readonly logger: ILogger,
    private readonly fileManager: typeof FileManager,
    private readonly videoConversionService: VideoConversionService
  ) {}

  /**
   * Executes the video merge strategy.
   * Merges the provided list of videos if there is more than one video.
   * If there is exactly one video, it replies with the single video.
   * Logs a message if there are no videos to merge.
   *
   * @param event - The ipcMainEvent that triggered the merge operation.
   * @returns A promise that resolves when the operation is completed.
   */
  public async execute(event: Electron.IpcMainEvent): Promise<void> {
    if (this.videos.length > 1) {
      // Prepare batches of videos to be merged
      const batches: IBatchVideo[] = this.videos.map((video, index) => ({
        path: this.fileManager.decodePath(video.pathname),
        index,
      }));

      // Log the number of videos to be merged
      this.logger.info(`Merging ${this.videos.length} videos`);

      // Perform the video merging operation
      await this.videoConversionService.combineVideos(batches, this.videos);
    } else if (this.videos.length === 1) {
      // Get the single video
      const video = this.videos[0];
      // Mark the video as a timeline
      Object.assign(video, { isTimeline: video.synced });
      // Reply with the single video if only one video exists
      event.reply(Channel.SCREESHOTS_CONVERTED, video);
    } else {
      // Log a message if there are no videos to merge
      this.logger.info('No videos to merge.');
    }
  }
}
