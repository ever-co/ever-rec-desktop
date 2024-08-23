import { IVideo } from '@ever-capture/shared-utils';
import { Repository } from './repository';

export const videoTable = 'video';

export class VideoRepository extends Repository<IVideo> {
  constructor() {
    super(videoTable);
  }
}
