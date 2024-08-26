import { IChunk } from '@ever-capture/shared-utils';
import { Repository } from './repository';
import { screenshotTable } from './screenshot.repository';
import { videoTable } from './video.repository';

export const chunkTable = 'chunk';

export class ChunkRepository extends Repository<IChunk> {
  constructor() {
    super(chunkTable);
  }

  public chunksByScreenshotIds(screenshotIds: string[]) {
    const query = this.connection<IChunk>(this.tableName);
    return query
      .select('*')
      .leftJoin(
        `${screenshotTable}`,
        `${this.tableName}.${screenshotTable}Id`,
        `${screenshotTable}.id`
      )
      .leftJoin(
        `${videoTable}`,
        `${this.tableName}.${videoTable}Id`,
        `${videoTable}.id`
      )
      .whereNull(`${videoTable}.parentId`)
      .whereIn(`${screenshotTable}.id`, screenshotIds)
      .orderBy('createdAt', 'asc');
  }
}
