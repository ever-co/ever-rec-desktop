import { IEventType, ILoggable, ILogger, IPowerEventHandler } from '@ever-co/shared-utils';
import { ElectronLogger } from '../../logger/electron-logger';

export class BatteryPowerSourceHandler
  implements IPowerEventHandler, ILoggable
{
  public logger: ILogger = new ElectronLogger('Battery Power Source Handler');
  public handleEvent(eventType: IEventType): void {
    if (eventType === 'on-battery') {
      this.logger.info('Switched to battery power. Reducing resource usage...');
      // Add logic for battery-saving mode.
    }
  }
}
