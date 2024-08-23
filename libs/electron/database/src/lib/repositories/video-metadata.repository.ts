import { IVideoMetadata } from '@ever-capture/shared-utils';
import { Repository } from './repository';

export const videoMetadataTable = 'video_metadata';

export class VideoMetadataRepository extends Repository<IVideoMetadata> {
  constructor() {
    super(videoMetadataTable);
  }
}
