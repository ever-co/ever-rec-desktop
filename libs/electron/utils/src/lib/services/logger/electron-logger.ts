import { ILogger } from '@ever-co/shared-utils';
import { defer, lastValueFrom } from 'rxjs';

export class ElectronLogger implements ILogger {
  private log$;
  private logger: any = null;

  constructor(private readonly name = 'Ever Capture') {
    this.log$ = defer(() => import('electron-log'));
  }

  private async getLogger(): Promise<any> {
    if (this.logger !== null) {
      return this.logger;
    }

    try {
      const log = await lastValueFrom(this.log$);
      this.logger = log.create({ logId: crypto.randomUUID() }) || console;
      return this.logger;
    } catch (e) {
      console.error('Failed to load electron-log', e);
      this.logger = console;
      return this.logger;
    }
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
