import { FileManager, VideoConversionService } from '@ever-co/electron-utils';
import {
  Channel,
  IBatchVideo,
  IConversionStrategy,
  ILogger,
  IVideo,
} from '@ever-co/shared-utils';

export class VideoMergeStrategy implements IConversionStrategy {
  constructor(
    private readonly videos: IVideo[],
    private readonly logger: ILogger,
    private readonly fileManager: typeof FileManager,
    private readonly isTimeline: boolean | undefined,
    private readonly videoConversionService: VideoConversionService
  ) {}

  public async execute(event: Electron.IpcMainEvent): Promise<void> {
    if (this.videos.length > 1) {
      const batches: IBatchVideo[] = this.videos.map((video, index) => ({
        path: this.fileManager.decodePath(video.pathname),
        index,
      }));
      this.logger.info(`Merging ${this.videos.length} videos`);
      await this.videoConversionService.combineVideos(
        batches,
        this.videos,
        this.isTimeline
      );
    } else if (this.videos.length === 1) {
      event.reply(Channel.SCREESHOTS_CONVERTED, this.videos[0]);
    } else {
      this.logger.info('No videos to merge.');
    }
  }
}
