import type {
  IScreenshot,
  IVideo,
  IVideoMetadata,
} from '@ever-capture/shared-utils';
import { Base } from './base.entity';

export class Video extends Base implements IVideo {
  public pathname: string;
  public synced?: boolean;
  public parent?: IVideo;
  public chunks?: IVideo[];
  public screenshots?: IScreenshot[];
  public metadata?: IVideoMetadata;
  public parentId?: string;

  constructor(pathname?: string, synced?: boolean) {
    super();
    this.pathname = pathname;
    this.synced = synced;
  }
}
