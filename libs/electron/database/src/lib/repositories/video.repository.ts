import { IFetchVideoInput, IVideo } from '@ever-capture/shared-utils';
import { chunkTable } from './chunk.repository';
import { Repository } from './repository';
import { videoMetadataTable } from './video-metadata.repository';

export const videoTable = 'video';

export class VideoRepository extends Repository<IVideo> {
  constructor() {
    super(videoTable);
  }

  public async getVideoByCriteria(input: IFetchVideoInput) {
    const { videoMetadata, screenshotIds } = input;

    const videos = await this.connection<IVideo>(`${this.tableName} as v`)
      .select(
        'v.*',
        'parent.*',
        'c.videoId',
        'c.screenshotId',
        this.connection.raw('COUNT(v.id) as count'),
        this.connection.raw('GROUP_CONCAT(c.screenshotId) as screenshotIds')
      )
      .leftJoin(`${chunkTable} as c`, 'c.videoId', 'v.id')
      .leftJoin(
        `${videoMetadataTable} as m`,
        `v.${videoMetadataTable}Id`,
        'm.id'
      )
      .leftJoin(`${this.tableName} as parent`, 'v.parentId', 'parent.id')
      .where({ ...videoMetadata })
      .whereIn('c.screenshotId', screenshotIds)
      .groupBy('v.id')
      .orderBy('v.createdAt', 'desc');

    if (!videos.length) {
      return null;
    }

    const video = {
      ...videos.find((v) => !v.parenId),
      count: videos.reduce((acc, { count }) => {
        return acc + count;
      }, 0),
      screenshotIds: videos.reduce((acc, { screenshotIds }) => {
        const current = screenshotIds.split(',').map(Number);
        return [...acc, ...current].toSorted((a, b) => a - b);
      }, []),
    };

    return video;
  }
}
