import {
  IEventType,
  ILoggable,
  ILogger,
  IPowerEventHandler,
} from '@ever-co/shared-utils';
import { powerMonitor } from 'electron';
import { ElectronLogger } from '../logger/electron-logger';

/**
 * Manages power-related events using an extensible handler system.
 */
export class PowerEventManager implements ILoggable {
  public logger: ILogger = new ElectronLogger('Power Event Manager');
  private handlers: Map<IEventType, IPowerEventHandler[]> = new Map();
  private registeredEvents: Set<IEventType> = new Set();
  private isListening = false;
  private static instance: PowerEventManager;

  private constructor() {
    // Prevent instantiation from outside
  }

  /**
   * Returns the singleton instance of PowerEventManager.
   * Creates a new instance if it does not exist yet.
   *
   * @returns The singleton instance of PowerEventManager.
   */
  public static getInstance(): PowerEventManager {
    if (!PowerEventManager.instance) {
      PowerEventManager.instance = new PowerEventManager();
    }
    return PowerEventManager.instance;
  }

  /**
   * Registers a handler for a specific event type.
   * @param eventType The type of the power event (e.g., 'suspend', 'resume').
   * @param handler The handler instance implementing the PowerEventHandler interface.
   */
  public registerHandler(
    eventType: IEventType,
    handler: IPowerEventHandler
  ): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType)?.push(handler);

    // Ensure listener is registered for this event type
    this.registerEventListener(eventType);
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
    this.registeredEvents.clear();
    this.logger.info('Stopped listening to power events.');
  }

  /**
   * Dispatches the event to all registered handlers for the specified event type.
   * @param eventType The event type to dispatch.
   */
  private dispatchEvent(eventType: IEventType): void {
    const handlers = this.handlers.get(eventType) || [];
    handlers.forEach((handler) => handler.handleEvent(eventType));
  }

  /**
   * Registers a listener for a specific event type if not already registered.
   * @param eventType The type of the power event.
   */
  private registerEventListener(eventType: IEventType): void {
    if (this.registeredEvents.has(eventType)) {
      this.logger.debug(`Listener already registered for event: ${eventType}`);
      return;
    }

    const existingListeners = powerMonitor.rawListeners(eventType);
    const listener = this.createListener(eventType);

    // Check if our specific listener is already registered
    if (existingListeners.includes(listener)) {
      this.logger.debug(
        `Specific listener already registered for event: ${eventType}`
      );
      return;
    }

    // Add the listener and register the event
    powerMonitor.on(eventType as any, listener);
    this.registeredEvents.add(eventType);

    this.logger.info(`Listener registered for event: ${eventType}`);
  }

  /**
   * Creates a listener for a specific event type, which dispatches the event to registered handlers.
   * @param eventType The type of the power event.
   * @returns A listener function bound to the event type.
   */
  private createListener(eventType: IEventType): () => void {
    return () => {
      this.logger.info(`Received event - ${eventType}`);
      this.dispatchEvent(eventType);
    };
  }
}
