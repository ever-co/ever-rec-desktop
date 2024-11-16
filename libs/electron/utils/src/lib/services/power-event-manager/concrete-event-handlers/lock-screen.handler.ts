import { ILoggable, ILogger, IPowerEventHandler } from '@ever-co/shared-utils';
import { ElectronLogger } from '../../logger/electron-logger';

export class LockScreenHandler implements IPowerEventHandler, ILoggable {
  public logger: ILogger = new ElectronLogger('Lock Screen Handler');
  public handleEvent(eventType: string): void {
    if (eventType === 'lock-screen') {
      this.logger.info('Screen locked. Securing sensitive data...');
      // Add logic for securing data or locking sensitive parts of the app.
    }
  }
}
