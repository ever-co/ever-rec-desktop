import { ILogger } from '@ever-co/shared-utils';
import * as log from 'electron-log';

export class ElectronLogger implements ILogger {
  public info(...message: any[]): void {
    log.info(...message);
  }

  public error(...message: any[]): void {
    log.error(...message);
  }

  public warn(...message: any[]): void {
    log.warn(...message);
  }

  public debug(...message: any[]): void {
    log.debug(...message);
  }
}
