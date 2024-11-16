import { IEventType, ILoggable, ILogger, IPowerEventHandler } from '@ever-co/shared-utils';
import { ElectronLogger } from '../../logger/electron-logger';
import { TimerScheduler } from '../../scheduler/timer-scheduler';

export class ResumeHandler implements IPowerEventHandler, ILoggable {
  public logger: ILogger = new ElectronLogger('Resume Handler');
  private scheduler = TimerScheduler.getInstance();
  public handleEvent(eventType: IEventType): void {
    if (eventType === 'resume') {
      this.logger.info('Handling resume event. Resuming tasks...');
      this.scheduler.start();
    }
  }
}
