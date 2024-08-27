import { IScreenshot } from '@ever-capture/shared-utils';
import { Repository } from './repository';
import { screenshotMetadataTable } from './screenshot-metadata.repository';

export const screenshotTable = 'screenshot';

export class ScreenshotRepository extends Repository<IScreenshot> {
  constructor() {
    super(screenshotTable);
  }

  private createMetadataSubQuery(includeTimestamps = true) {
    const fields = [
      `'id', ${screenshotMetadataTable}.id`,
      `'name', ${screenshotMetadataTable}.name`,
      `'icon', ${screenshotMetadataTable}.icon`,
      `'description', ${screenshotMetadataTable}.description`,
    ];

    if (includeTimestamps) {
      fields.push(
        `'createdAt', ${screenshotMetadataTable}.createdAt`,
        `'updatedAt', ${screenshotMetadataTable}.updatedAt`
      );
    }

    return this.connection.raw(`json_object(${fields.join(', ')}) as metadata`);
  }

  private mapScreenshotMetadata(screenshots: any[]) {
    return screenshots.map((screenshot) => ({
      ...screenshot,
      metadata: JSON.parse(screenshot.metadata),
    }));
  }

  public async findAllScreenshotsWithMetadata(
    screenshotIds?: string[],
    where?: Record<string, string | number>
  ) {
    const subQuery = this.createMetadataSubQuery();
    const query = this.connection(this.tableName)
      .select(`${this.tableName}.*`, subQuery)
      .leftJoin(
        `${screenshotMetadataTable}`,
        `${screenshotMetadataTable}.id`,
        `${this.tableName}.${screenshotMetadataTable}Id`
      )
      .groupBy(`${this.tableName}.id`)
      .orderBy('createdAt', 'asc');

    if (screenshotIds) {
      query.whereIn(`${this.tableName}.id`, screenshotIds);
    }

    if (where) {
      query.where(where);
    }

    const screenshotsWithMetadata = await query;
    return this.mapScreenshotMetadata(screenshotsWithMetadata);
  }

  public async findAllByDescription(description: string) {
    const subQuery = this.createMetadataSubQuery(false);
    const screenshotsWithMetadata = await this.connection(this.tableName)
      .select(`${this.tableName}.*`, subQuery)
      .leftJoin(
        `${screenshotMetadataTable}`,
        `${screenshotMetadataTable}.id`,
        `${this.tableName}.${screenshotMetadataTable}Id`
      )
      .where(
        `${screenshotMetadataTable}.description`,
        'like',
        `%${description}%`
      )
      .groupBy(`${this.tableName}.id`)
      .orderBy('createdAt', 'asc');

    return this.mapScreenshotMetadata(screenshotsWithMetadata);
  }

  public async findByIds(ids: string[]) {
    const subQuery = this.createMetadataSubQuery();
    const screenshotsWithMetadata = await this.connection(this.tableName)
      .select(`${this.tableName}.*`, subQuery)
      .leftJoin(
        `${screenshotMetadataTable}`,
        `${screenshotMetadataTable}.id`,
        `${this.tableName}.${screenshotMetadataTable}Id`
      )
      .whereIn(`${this.tableName}.id`, ids)
      .groupBy(`${this.tableName}.id`)
      .orderBy('createdAt', 'asc');

    return this.mapScreenshotMetadata(screenshotsWithMetadata);
  }

  public async findOneWithMetadataById(id: string) {
    const [screenshot] = await this.findByIds([id]);
    return screenshot;
  }
}
