import { IFetchVideoInput, IVideo } from '@ever-capture/shared-utils';
import { chunkTable } from './chunk.repository';
import { Repository } from './repository';
import { screenshotTable } from './screenshot.repository';
import { videoMetadataTable } from './video-metadata.repository';

export const videoTable = 'video';

export class VideoRepository extends Repository<IVideo> {
  constructor() {
    super(videoTable);
  }

  public getFinalVideo(input: IFetchVideoInput) {
    return this.connection<IVideo>(this.tableName)
      .select(`${this.tableName}.*`)
      .count(`${this.tableName}.id as count`)
      .leftJoin(
        `${chunkTable}`,
        `${chunkTable}.${this.tableName}Id`,
        `${this.tableName}.id`
      )
      .leftJoin(
        `${videoMetadataTable}`,
        `${this.tableName}.${videoMetadataTable}Id`,
        `${videoMetadataTable}.id`
      )
      .whereNull(`${this.tableName}.parentId`)
      .where({ ...input.videoMetadata })
      .whereIn(`${chunkTable}.${screenshotTable}Id`, input.screenshotIds)
      .groupBy(`${this.tableName}.id`)
      .orderBy(`${this.tableName}.createdAt`, 'desc')
      .first();
  }
}
