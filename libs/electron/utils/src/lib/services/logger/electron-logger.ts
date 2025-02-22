import { ILogger } from '@ever-co/shared-utils';
import { defer, lastValueFrom } from 'rxjs';

export class ElectronLogger implements ILogger {
  private log$ = defer(() => import('electron-log'));

  constructor(private readonly name = 'Ever Capture') {}

  private getLogger() {
    return lastValueFrom(this.log$);
  }

  public async info(...message: any[]): Promise<void> {
    (await this.getLogger()).info(`[${this.name}]`, ...message);
  }

  public async error(...message: any[]): Promise<void> {
    (await this.getLogger()).error(`[${this.name}]`, ...message);
  }

  public async warn(...message: any[]): Promise<void> {
    (await this.getLogger()).warn(`[${this.name}]`, ...message);
  }

  public async debug(...message: any[]): Promise<void> {
    (await this.getLogger()).debug(`[${this.name}]`, ...message);
  }
}
