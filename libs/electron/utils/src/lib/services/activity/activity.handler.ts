import {
  IdleState,
  IdleStateChange,
  ILoggable,
  ILogger,
} from '@ever-co/shared-utils';
import { powerMonitor } from 'electron';
import { EventEmitter } from 'events';
import { ElectronLogger } from '../logger/electron-logger';
import { TimerScheduler } from '../scheduler/timer-scheduler';

/**
 * Custom error class for ActivityHandler-specific errors
 */
export class ActivityHandlerError extends Error {
  constructor(message: string, public readonly reason?: Error) {
    super(message);
    this.cause = reason;
    this.name = 'ActivityHandlerError';
  }
}

export class ActivityHandler implements ILoggable {
  private readonly emitter: EventEmitter;
  private readonly scheduler: TimerScheduler;
  public readonly logger: ILogger;

  private previousIdleState: IdleState;
  private previousTime: number;
  private isDisposed: boolean;

  constructor() {
    this.emitter = new EventEmitter();
    this.scheduler = TimerScheduler.getInstance();
    this.previousTime = 0;
    this.isDisposed = false;
    this.logger = new ElectronLogger('Activity Handler');

    // Initialize state
    this.previousIdleState = this.getIdleStateSafely();
    this.initializeScheduler();
  }

  /**
   * Gets the system idle time in seconds.
   * @throws {ActivityHandlerError} If there's an error retrieving the idle time
   */
  public get idleTime(): number {
    this.throwIfDisposed();
    try {
      return powerMonitor.getSystemIdleTime();
    } catch (error) {
      throw new ActivityHandlerError(
        'Failed to retrieve system idle time',
        error as Error
      );
    }
  }

  /**
   * Gets the current system idle state.
   * @throws {ActivityHandlerError} If there's an error retrieving the idle state
   */
  public get idleState(): IdleState {
    this.throwIfDisposed();
    return this.getIdleStateSafely();
  }

  /**
   * Starts monitoring system activity.
   * @throws {ActivityHandlerError} If monitoring is already started or instance is disposed
   */
  public startMonitoring(): void {
    this.throwIfDisposed();
    try {
      this.scheduler.start();
      this.logger.info('Activity monitoring started');
    } catch (error) {
      throw new ActivityHandlerError(
        'Failed to start monitoring',
        error as Error
      );
    }
  }

  /**
   * Stops monitoring system activity.
   */
  public stopMonitoring(): void {
    if (!this.isDisposed) {
      this.scheduler.stop();
      this.logger.info('Activity monitoring stopped');
    }
  }

  /**
   * Registers a callback to listen for idle state changes.
   * @param callback Function to be invoked on idle state changes
   * @returns A cleanup function to remove the listener
   */
  public onChange(callback: (data: IdleStateChange) => void): () => void {
    this.throwIfDisposed();
    this.emitter.on('change', callback);
    return () => this.emitter.off('change', callback);
  }

  /**
   * Disposes of the ActivityHandler instance and cleans up resources.
   */
  public dispose(): void {
    if (!this.isDisposed) {
      this.stopMonitoring();
      this.emitter.removeAllListeners();
      this.isDisposed = true;
      this.logger.info('ActivityHandler disposed');
    }
  }

  private getIdleStateSafely(): IdleState {
    try {
      const state = powerMonitor.getSystemIdleState(1);
      return Object.values(IdleState).includes(state as IdleState)
        ? (state as IdleState)
        : IdleState.UNKNOWN;
    } catch (error) {
      this.logger.info('Error retrieving system idle state:', error);
      return IdleState.UNKNOWN;
    }
  }

  private initializeScheduler(): void {
    this.scheduler.onStart(this.handleStateChange.bind(this));
    this.scheduler.onTick(this.monitoring.bind(this));
    this.scheduler.onStop(this.handleStateChange.bind(this));
  }

  private monitoring(seconds = 0): void {
    const currentState = this.getIdleStateSafely();
    if (currentState !== this.previousIdleState) {
      this.handleStateChange(seconds);
    }
  }

  private handleStateChange(seconds = 0): void {
    const currentState = this.getIdleStateSafely();
    const currentTime = this.idleTime;
    const duration = Math.max(0, seconds - this.previousTime);

    const changeData: IdleStateChange = {
      idleTime: currentTime,
      idleState: currentState,
      duration,
      timestamp: Date.now(),
    };

    this.emitter.emit('change', changeData);
    this.previousIdleState = currentState;
    this.previousTime = Math.max(0, seconds);
  }

  private throwIfDisposed(): void {
    if (this.isDisposed) {
      throw new ActivityHandlerError('ActivityHandler has been disposed');
    }
  }
}
