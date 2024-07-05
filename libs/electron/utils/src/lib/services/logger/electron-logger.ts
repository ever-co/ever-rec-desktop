import { ILogger } from '@prototype/shared/utils';
import * as log from 'electron-log';

export class ElectronLogger implements ILogger {
  public info(message: string): void {
    log.info(message);
  }

  public error(message: string): void {
    log.error(message);
  }

  public warn(message: string): void {
    log.warn(message);
  }

  public debug(message: string): void {
    log.debug(message);
  }
}
