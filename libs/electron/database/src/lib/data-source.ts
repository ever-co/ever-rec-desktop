import { FileManager } from '@prototype/electron/utils';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { migrations } from './db/migration';
import { ScreenshotMetadata } from './entities/screenshot-metadata.entity';
import { Screenshot } from './entities/screenshot.entity';
import { ScreenshotSubscriber } from './subscribers/screenshot.subscriber';

const database = FileManager.createFilePathSync(
  'databases',
  'ever.capture.sqlite'
);

export const appDataSource = new DataSource({
  type: 'better-sqlite3',
  database,
  entities: [Screenshot, ScreenshotMetadata],
  synchronize: false,
  logging: true,
  subscribers: [ScreenshotSubscriber],
  migrationsRun: true,
  migrations,
  prepareDatabase: (db) => {
    db.pragma('cipher = "sqlcipher"');
    db.pragma('journal_mode = WAL');
  },
});

async function bootstrapDatabase() {
  try {
    await appDataSource.initialize();
    console.log('[Database] - Bootstrapped');
  } catch (error) {
    console.error(error);
  }
}

bootstrapDatabase();
