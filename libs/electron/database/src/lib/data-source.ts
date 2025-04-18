import { FileManager } from '@ever-co/electron-utils';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Activity } from './entities/activity.entity';
import { Application } from './entities/application.entity';
import { ScreenshotMetadata } from './entities/screenshot-metadata.entity';
import { Screenshot } from './entities/screenshot.entity';
import { TimeLog } from './entities/time-log.entity';
import { Timeline } from './entities/timeline.entity';
import { VideoMetadata } from './entities/video-metadata.entity';
import { Video } from './entities/video.entity';
import { ScreenshotSubscriber } from './subscribers/screenshot.subscriber';
import { VideoMetadataSubscriber } from './subscribers/video-metadata.subscriber';
import { VideoSubscriber } from './subscribers/video.subscriber';
import { PhotoSubscriber } from './subscribers/photo.subscriber';
import { Photo } from './entities/photo.entity';
import { PhotoMetadata } from './entities/metadata.entity';

const database = FileManager.createFilePathSync(
  'db',
  'ever.rec.desktop.sqlite'
);

export const appDataSource = new DataSource({
  type: 'better-sqlite3',
  database,
  entities: [
    Screenshot,
    ScreenshotMetadata,
    Video,
    VideoMetadata,
    TimeLog,
    Timeline,
    Activity,
    Application,
    Photo,
    PhotoMetadata,
  ],
  synchronize: true,
  logging: true,
  subscribers: [
    ScreenshotSubscriber,
    VideoSubscriber,
    VideoMetadataSubscriber,
    PhotoSubscriber,
  ],
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
