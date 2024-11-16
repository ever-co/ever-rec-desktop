import { IEventType, ILoggable, ILogger, IPowerEventHandler } from '@ever-co/shared-utils';
import { ElectronLogger } from '../../logger/electron-logger';
import { TimerScheduler } from '../../scheduler/timer-scheduler';

export class LockScreenHandler implements IPowerEventHandler, ILoggable {
  public logger: ILogger = new ElectronLogger('Lock Screen Handler');
  private scheduler = TimerScheduler.getInstance();
  public handleEvent(eventType: IEventType): void {
    if (eventType === 'lock-screen') {
      this.logger.info('Screen locked. Securing sensitive data...');
      this.scheduler.pause();
    }
  }
}
