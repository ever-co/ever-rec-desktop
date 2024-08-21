import type { IVideo, IVideoMetadata } from '@ever-capture/shared-utils';
import { Base } from './base.entity';

export class VideoMetadata extends Base implements IVideoMetadata {
  public frameRate?: number;
  public resolution?: string;
  public codec?: string;
  public batch?: number;
  public duration?: number;
  public video?: IVideo;

  constructor(partial: Partial<VideoMetadata> = {}) {
    super();
    Object.assign(this, partial);
  }
}
