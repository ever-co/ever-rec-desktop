import { IVideo, IVideoService } from '@ever-co/shared-utils';
import { IsNull, Not } from 'typeorm';

export class TimelineVideoSearch {
  private readonly videoService: IVideoService;
  private readonly timeLogId: string;

  /**
   * @param videoService The service to interact with the video database.
   * @param timeLogId The id of the time log to search for videos.
   */
  constructor(videoService: IVideoService, timeLogId: string) {
    this.videoService = videoService;
    this.timeLogId = timeLogId;
  }

  /**
   * Finds a video associated with the timeline. If no video is found with a
   * timeline, it will find all videos associated with the time log and returns
   * them.
   * @returns A promise that resolves with an array of videos and the count.
   * The array will contain at most one video if a timeline is found.
   * Otherwise, it will contain all videos associated with the time log.
   */
  public async tryFindVideo(): Promise<[IVideo[], number]> {
    // First, try to find a video with a timeline
    const video = await this.videoService.findOne({
      relations: ['metadata'],
      where: {
        timelines: { timeLogId: this.timeLogId },
        screenshots: { id: Not(IsNull()) },
        parent: { id: IsNull() },
      },
    });

    if (video) {
      // If a video is found, return it
      return [[video], 1];
    }

    // If no video is found, find all videos associated with the time log
    return await this.videoService.findAndCount({
      relations: ['metadata', 'screenshots'],
      where: {
        timeLog: { id: this.timeLogId },
        parent: { id: IsNull() },
      },
    });
  }
}
