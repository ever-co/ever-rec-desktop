import { ElectronLogger, FileManager } from '@ever-capture/electron-utils';
import { ILoggable, ILogger } from '@ever-capture/shared-utils';
import { Knex, knex } from 'knex';
import { structure } from './migrations/structure.migration';

export class BetterSqliteProvider implements ILoggable {
  private static _instance: BetterSqliteProvider;
  public logger: ILogger = new ElectronLogger();
  private _connection: Knex;

  private constructor() {
    try {
      this._connection = knex(this.config);
      this.logger.info('[provider]: Better SQLite connected...');
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async migrate(): Promise<void> {
    try {
      await structure(this.connection);
    } catch (error) {
      this.logger.error(error);
    }
  }

  public static get instance(): BetterSqliteProvider {
    if (!this._instance) {
      this._instance = new BetterSqliteProvider();
    }
    return this._instance;
  }

  public get connection(): Knex {
    return this._connection;
  }

  public get config(): Knex.Config {
    return {
      client: 'better-sqlite3',
      connection: {
        filename: this.databaseFilename,
        timezone: 'utc',
      },
      useNullAsDefault: true,
      debug: false,
      asyncStackTraces: true,
    };
  }

  public get databaseFilename() {
    return FileManager.createFilePathSync('databases', 'ever.capture.sqlite');
  }
}
