import { ILogger } from '@ever-co/shared-utils';
import * as log from 'electron-log';

export class ElectronLogger implements ILogger {
  constructor(private readonly name = 'Ever Capture') {}
  public info(...message: any[]): void {
    log.info(`[${this.name}]`, ...message);
  }

  public error(...message: any[]): void {
    log.error(`[${this.name}]`, ...message);
  }

  public warn(...message: any[]): void {
    log.warn(`[${this.name}]`, ...message);
  }

  public debug(...message: any[]): void {
    log.debug(`[${this.name}]`, ...message);
  }
}
