import { app } from 'electron';
import { join } from 'path';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Screenshot } from './entities/screenshot.entity';
import { ScreenshotSubscriber } from './subscribers/screenshot.subscriber';

export const appDataSource = new DataSource({
  type: 'better-sqlite3',
  database: join(app.getPath('userData'), 'database', 'prototype.sqlite'),
  entities: [Screenshot],
  synchronize: true,
  logging: true,
  subscribers: [ScreenshotSubscriber],
  migrations: [],
  prepareDatabase: (db) => {
    db.pragma(`cipher='sqlcipher'`);
  },
});

appDataSource
  .initialize()
  .then(() => {
    // here you can start to work with your database
    console.log('[Database] - Bootstraped');
  })
  .catch((error) => console.log(error));
