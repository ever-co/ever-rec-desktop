import { FileManager } from '@ever-co/electron-utils';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { ScreenshotMetadata } from './entities/screenshot-metadata.entity';
import { Screenshot } from './entities/screenshot.entity';
import { VideoMetadata } from './entities/video-metadata.entity';
import { Video } from './entities/video.entity';
import { ScreenshotSubscriber } from './subscribers/screenshot.subscriber';
import { VideoSubscriber } from './subscribers/video.subscriber';

const database = FileManager.createFilePathSync(
  'databases',
  'ever.capture.sqlite'
);

export const appDataSource = new DataSource({
  type: 'better-sqlite3',
  database,
  entities: [Screenshot, ScreenshotMetadata, Video, VideoMetadata],
  synchronize: true,
  logging: true,
  subscribers: [ScreenshotSubscriber, VideoSubscriber],
  enableWAL: true,
  prepareDatabase: (db) => {
    db.pragma('cipher = "sqlcipher"');
  },
});

export async function bootstrapDatabase() {
  try {
    await appDataSource.initialize();
    console.log('[Database] - Bootstrapped');
  } catch (error) {
    console.error(error);
  }
}
