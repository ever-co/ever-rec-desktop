import { ILoggable, ILogger, IPowerEventHandler } from '@ever-co/shared-utils';
import { ElectronLogger } from '../../logger/electron-logger';

export class AcPowerSourceHandler implements IPowerEventHandler, ILoggable {
  public logger: ILogger = new ElectronLogger('AC Power Source Handler');
  public handleEvent(eventType: string): void {
    if (eventType === 'on-ac') {
      this.logger.info(
        'Switched to AC power. Enabling high-performance mode...'
      );
      // Add logic for high-performance mode.
    }
  }
}
