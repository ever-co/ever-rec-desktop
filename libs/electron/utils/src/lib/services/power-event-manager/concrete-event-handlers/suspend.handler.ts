import { ILoggable, ILogger, IPowerEventHandler } from '@ever-co/shared-utils';
import { ElectronLogger } from '../../logger/electron-logger';

export class SuspendHandler implements IPowerEventHandler, ILoggable {
  public logger: ILogger = new ElectronLogger('Lock Screen Handler');
  public handleEvent(eventType: string): void {
    if (eventType === 'suspend') {
      this.logger.info(
        'SuspendHandler: Handling suspend event. Pausing tasks...'
      );
      // Add logic to pause tasks or processes.
    }
  }
}
