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
 * Implements the singleton pattern and ensures proper event listener cleanup.
 */
export class PowerEventManager implements ILoggable {
  public logger: ILogger = new ElectronLogger('Power Event Manager');
  private handlers: Map<IEventType, Set<IPowerEventHandler>> = new Map();
  private eventListeners: Map<IEventType, () => void> = new Map();
  private isListening = false;
  private static instance: PowerEventManager;

  private constructor() {
    // Prevent instantiation from outside
    process.on('exit', () => this.cleanup());
    // Handle unexpected shutdowns
    process.on('SIGINT', () => this.cleanup());
    process.on('SIGTERM', () => this.cleanup());
  }

  /**
   * Returns the singleton instance of PowerEventManager.
   */
  public static getInstance(): PowerEventManager {
    if (!PowerEventManager.instance) {
      PowerEventManager.instance = new PowerEventManager();
    }
    return PowerEventManager.instance;
  }

  /**
   * Registers a handler for a specific event type.
   * Prevents duplicate handlers and manages event listeners efficiently.
   */
  public registerHandler(
    eventType: IEventType,
    handler: IPowerEventHandler
  ): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }

    const handlers = this.handlers.get(eventType);
    if (handlers?.has(handler)) {
      this.logger.warn(
        `Handler already registered for event type: ${eventType}`
      );
      return;
    }

    handlers?.add(handler);
    this.ensureEventListener(eventType);

    this.logger.debug(
      `Registered handler for ${eventType}. Total handlers: ${handlers?.size}`
    );
  }

  /**
   * Unregisters a handler for a specific event type.
   * Cleans up event listeners when no handlers remain.
   */
  public unregisterHandler(
    eventType: IEventType,
    handler: IPowerEventHandler
  ): void {
    const handlers = this.handlers.get(eventType);
    if (!handlers) return;

    handlers.delete(handler);

    if (handlers.size === 0) {
      this.removeEventListener(eventType);
      this.handlers.delete(eventType);
    }

    this.logger.debug(
      `Unregistered handler for ${eventType}. Remaining handlers: ${
        handlers?.size || 0
      }`
    );
  }

  /**
   * Starts the power event monitoring system.
   */
  public start(): void {
    if (this.isListening) {
      this.logger.warn('PowerEventManager is already running.');
      return;
    }
    this.isListening = true;

    // Reattach existing event listeners if any
    for (const eventType of this.handlers.keys()) {
      this.ensureEventListener(eventType);
    }

    this.logger.info('PowerEventManager started successfully.');
  }

  /**
   * Stops the power event monitoring system and cleans up resources.
   */
  public stop(): void {
    if (!this.isListening) {
      this.logger.warn('PowerEventManager is not currently running.');
      return;
    }

    this.cleanup();
    this.isListening = false;
    this.logger.info('PowerEventManager stopped successfully.');
  }

  /**
   * Ensures an event listener is properly registered for the given event type.
   */
  private ensureEventListener(eventType: IEventType): void {
    if (!this.isListening || this.eventListeners.has(eventType)) return;

    const listener = this.createListener(eventType);
    this.eventListeners.set(eventType, listener);
    powerMonitor.on(eventType as any, listener);

    this.logger.debug(`Event listener registered for: ${eventType}`);
  }

  /**
   * Removes the event listener for a specific event type.
   */
  private removeEventListener(eventType: IEventType): void {
    const listener = this.eventListeners.get(eventType);
    if (!listener) return;

    powerMonitor.removeListener(eventType as any, listener);
    this.eventListeners.delete(eventType);

    this.logger.debug(`Event listener removed for: ${eventType}`);
  }

  /**
   * Creates a bound event listener function for the specified event type.
   */
  private createListener(eventType: IEventType): () => void {
    return () => {
      if (!this.isListening) return;

      this.logger.info(`Power event received: ${eventType}`);
      const handlers = this.handlers.get(eventType);

      handlers?.forEach((handler) => {
        try {
          handler.handleEvent(eventType);
        } catch (error) {
          this.logger.error(
            `Error in handler for ${eventType}: ${
              error instanceof Error ? error.message : 'Unknown error'
            }`
          );
        }
      });
    };
  }

  /**
   * Performs complete cleanup of all event listeners and handlers.
   */
  private cleanup(): void {
    // Remove all power monitor event listeners
    for (const [eventType, listener] of this.eventListeners) {
      powerMonitor.removeListener(eventType as any, listener);
    }

    this.eventListeners.clear();
    this.handlers.clear();

    this.logger.info('PowerEventManager cleanup completed.');
  }
}
