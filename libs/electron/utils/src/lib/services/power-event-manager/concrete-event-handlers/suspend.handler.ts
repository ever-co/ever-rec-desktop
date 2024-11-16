import {
  IEventType,
  ILoggable,
  ILogger,
  IPowerEventHandler,
} from '@ever-co/shared-utils';
import { ElectronLogger } from '../../logger/electron-logger';
import { TimerScheduler } from '../../scheduler/timer-scheduler';

export class SuspendHandler implements IPowerEventHandler, ILoggable {
  public logger: ILogger = new ElectronLogger('Suspend Handler');
  public scheduler = TimerScheduler.getInstance();

  public handleEvent(eventType: IEventType): void {
    if (eventType === 'suspend') {
      this.logger.info(
        'SuspendHandler: Handling suspend event. Pausing tasks...'
      );
      this.scheduler.stop();
    }
  }
}
