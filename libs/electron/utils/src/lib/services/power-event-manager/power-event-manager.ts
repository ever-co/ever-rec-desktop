import { ILoggable, ILogger, IPowerEventHandler } from '@ever-co/shared-utils';
import { powerMonitor } from 'electron';
import { ElectronLogger } from '../logger/electron-logger';

/**
 * Manages power-related events using an extensible handler system.
 */
export class PowerEventManager implements ILoggable {
  public logger: ILogger = new ElectronLogger('Power Event Manager');
  private handlers: Map<string, IPowerEventHandler[]> = new Map();
  private isListening = false;
  private static instance: PowerEventManager;

  private constructor() {
    //Not instanciable out of this class
  }

  /**
   * Returns the singleton instance of PowerEventManager.
   * Creates a new instance if it does not exist yet.
   *
   * @returns The singleton instance of PowerEventManager.
   */
  public static getInstance(): PowerEventManager {
    if (!this.instance) {
      this.instance = new PowerEventManager();
    }
    return this.instance;
  }

  /**
   * Registers a handler for a specific event type.
   * @param eventType The type of the power event (e.g., 'suspend', 'resume').
   * @param handler The handler instance implementing the PowerEventHandler interface.
   */
  public registerHandler(eventType: string, handler: IPowerEventHandler): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType)?.push(handler);
  }

  /**
   * Starts listening to power events.
   * Safeguards against multiple initializations.
   */
  public start(): void {
    if (this.isListening) {
      this.logger.warn('Already started.');
      return;
    }
    this.isListening = true;

    powerMonitor.on('suspend', this.createListener('suspend'));
    powerMonitor.on('resume', this.createListener('resume'));
    powerMonitor.on('on-ac', this.createListener('on-ac'));
    powerMonitor.on('on-battery', this.createListener('on-battery'));
    powerMonitor.on('lock-screen', this.createListener('lock-screen'));
    powerMonitor.on('unlock-screen', this.createListener('unlock-screen'));

    this.logger.info('Started listening to power events.');
  }

  /**
   * Stops listening to power events and cleans up resources.
   */
  public stop(): void {
    if (!this.isListening) {
      this.logger.warn('Not currently active.');
      return;
    }
    this.isListening = false;

    powerMonitor.removeAllListeners();
    this.logger.info('Stopped listening to power events.');
  }

  /**
   * Dispatches the event to all registered handlers for the specified event type.
   * @param eventType The event type to dispatch.
   */
  private dispatchEvent(eventType: string): void {
    const handlers = this.handlers.get(eventType) || [];
    handlers.forEach((handler) => handler.handleEvent(eventType));
  }

  /**
   * Creates a listener for a specific event type, which dispatches the event to registered handlers.
   * @param eventType The type of the power event.
   * @returns A listener function bound to the event type.
   */
  private createListener(eventType: string): () => void {
    return () => {
      this.logger.info(`Received event - ${eventType}`);
      this.dispatchEvent(eventType);
    };
  }
}
