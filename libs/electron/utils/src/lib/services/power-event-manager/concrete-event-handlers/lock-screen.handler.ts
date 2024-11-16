import { ILoggable, ILogger, IPowerEventHandler } from '@ever-co/shared-utils';
import { ElectronLogger } from '../../logger/electron-logger';
import { TimerScheduler } from '../../scheduler/timer-scheduler';

export class LockScreenHandler implements IPowerEventHandler, ILoggable {
  public logger: ILogger = new ElectronLogger('Lock Screen Handler');
  public scheduler = TimerScheduler.getInstance();
  public handleEvent(eventType: string): void {
    if (eventType === 'lock-screen') {
      this.logger.info('Screen locked. Securing sensitive data...');
      this.scheduler.pause();
    }
  }
}
