import { IEventType, ILoggable, ILogger, IPowerEventHandler } from '@ever-co/shared-utils';
import { ElectronLogger } from '../../logger/electron-logger';
import { TimerScheduler } from '../../scheduler/timer-scheduler';

export class UnlockScreenHandler implements IPowerEventHandler, ILoggable {
  public logger: ILogger = new ElectronLogger('Unlock Screen Handler');
  private scheduler = TimerScheduler.getInstance();
  public handleEvent(eventType: IEventType): void {
    if (eventType === 'unlock-screen') {
      this.logger.info('Screen unlocked. Restoring user interface...');
      this.scheduler.resume();
    }
  }
}
