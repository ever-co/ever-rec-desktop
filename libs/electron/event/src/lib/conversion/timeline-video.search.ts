import { IVideo, IVideoService } from '@ever-co/shared-utils';
import { IsNull, Not } from 'typeorm';

export class TimelineVideoSearch {
  private readonly videoService: IVideoService;
  private readonly timeLogId: string;

  constructor(videoService: IVideoService, timeLogId: string) {
    this.videoService = videoService;
    this.timeLogId = timeLogId;
  }

  public async tryFindVideo(): Promise<[IVideo[], number]> {
    const video = await this.videoService.findOne({
      relations: ['metadata'],
      where: {
        timelines: { timeLogId: this.timeLogId },
        screenshots: { id: Not(IsNull()) },
        parent: { id: IsNull() },
      },
    });

    if (video) {
      return [[video], 1];
    }

    return await this.videoService.findAndCount({
      relations: ['metadata', 'screenshots'],
      where: {
        timeLog: { id: this.timeLogId },
        parent: { id: IsNull() },
      },
    });
  }
}
