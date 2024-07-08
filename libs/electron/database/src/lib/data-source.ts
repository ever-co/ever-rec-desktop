import { FileManager } from '@prototype/electron/utils';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { ScreenshotMetadata } from './entities/screenshot-metadata.entity';
import { Screenshot } from './entities/screenshot.entity';
import { ScreenshotSubscriber } from './subscribers/screenshot.subscriber';

const database = FileManager.createFilePathSync('database', 'prototype.sqlite');

export const appDataSource = new DataSource({
  type: 'better-sqlite3',
  database,
  entities: [Screenshot, ScreenshotMetadata],
  synchronize: true,
  logging: true,
  subscribers: [ScreenshotSubscriber],
  migrations: [],
  prepareDatabase: (db) => {
    db.pragma(`cipher='sqlcipher'`);
    db.pragma(`journal_mode=WAL`);
  },
});

appDataSource
  .initialize()
  .then(() => {
    // here you can start to work with your database
    console.log('[Database] - Bootstraped');
  })
  .catch((error) => console.log(error));
