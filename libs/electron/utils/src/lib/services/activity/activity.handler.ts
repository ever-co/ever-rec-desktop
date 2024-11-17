import { powerMonitor } from 'electron';
import { EventEmitter } from 'events';
import { TimerScheduler } from '../scheduler/timer-scheduler';

/** Possible system idle states */
export type IdleState = 'active' | 'idle' | 'locked' | 'unknown';

/** Event data structure for idle state changes */
export interface IdleStateChange {
  idleTime: number;
  idleState: IdleState;
  duration: number;
}

/**
 * ActivityHandler monitors system idle state and time, emitting events when changes occur.
 *
 * @example
 * ```typescript
 * const activityHandler = new ActivityHandler();
 * activityHandler.onChange(({ idleState, idleTime }) => {
 *   console.log(`System is ${idleState} for ${idleTime} seconds`);
 * });
 * activityHandler.startMonitoring();
 * ```
 */
export class ActivityHandler {
  private previousIdleState: IdleState;
  private readonly emitter: EventEmitter;
  private readonly scheduler: TimerScheduler;
  private previousTime = 0;

  constructor() {
    this.emitter = new EventEmitter();
    this.scheduler = TimerScheduler.getInstance();
    this.previousIdleState = this.getIdleStateSafely();

    this.initializeScheduler();
  }

  /**
   * Gets the system idle time in seconds.
   * @returns {number} Idle time in seconds.
   */
  public get idleTime(): number {
    try {
      return powerMonitor.getSystemIdleTime();
    } catch (error) {
      console.error('Error retrieving system idle time:', error);
      return 0;
    }
  }

  /**
   * Gets the current system idle state.
   * @returns {IdleState} Current idle state.
   */
  public get idleState(): IdleState {
    return this.getIdleStateSafely();
  }

  /**
   * Safely retrieves the current idle state with error handling.
   * @returns {IdleState} Current idle state or 'unknown' if retrieval fails.
   */
  private getIdleStateSafely(): IdleState {
    try {
      return powerMonitor.getSystemIdleState(1) as IdleState;
    } catch (error) {
      console.error('Error retrieving system idle state:', error);
      return 'unknown';
    }
  }

  /**
   * Initializes the timer scheduler with appropriate callbacks.
   */
  private initializeScheduler(): void {
    this.scheduler.onStart(this.currentState.bind(this));
    this.scheduler.onTick(this.monitoring.bind(this));
    this.scheduler.onStop(this.currentState.bind(this));
  }

  /**
   * Starts monitoring system activity and emits events on state changes.
   */
  private monitoring(seconds = 0): void {
    const currentState = this.getIdleStateSafely();
    const currentTime = this.idleTime;

    if (currentState !== this.previousIdleState) {
      const changeData: IdleStateChange = {
        idleTime: currentTime,
        idleState: currentState,
        duration: seconds > this.previousTime ? seconds - this.previousTime : 0,
      };

      this.emitter.emit('change', changeData);
      this.previousIdleState = currentState;
      this.previousTime = Math.max(0, seconds);
    }
  }

  /**
   * Gets the current system idle state, calculates the duration since the previous idle state,
   * and emits a 'change' event with the new idle state and duration.
   *
   * @param {number} [seconds=0] The number of seconds to use as the current time.
   * @returns {void}
   */
  private currentState(seconds = 0): void {
    const currentState = this.getIdleStateSafely();
    const currentTime = this.idleTime;

    const changeData: IdleStateChange = {
      idleTime: currentTime,
      idleState: currentState,
      duration: seconds > this.previousTime ? seconds - this.previousTime : 0,
    };

    this.emitter.emit('change', changeData);
    this.previousIdleState = currentState;
    this.previousTime = Math.max(0, seconds);
  }

  /**
   * Registers a callback to listen for idle state changes.
   * @param callback Function to be invoked on idle state changes.
   */
  public onChange(callback: (data: IdleStateChange) => void): void {
    this.emitter.on('change', callback);
  }
}
