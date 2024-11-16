import { ILoggable, ILogger, IPowerEventHandler } from '@ever-co/shared-utils';
import { ElectronLogger } from '../../logger/electron-logger';
import { TimerScheduler } from '../../scheduler/timer-scheduler';

export class UnlockScreenHandler implements IPowerEventHandler, ILoggable {
  public logger: ILogger = new ElectronLogger('Unlock Screen Handler');
  public scheduler = TimerScheduler.getInstance();
  public handleEvent(eventType: string): void {
    if (eventType === 'unlock-screen') {
      this.logger.info('Screen unlocked. Restoring user interface...');
      this.scheduler.resume();
    }
  }
}
