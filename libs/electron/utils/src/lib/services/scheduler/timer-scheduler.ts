import { ILoggable, ILogger } from '@ever-co/shared-utils';
import { EventEmitter } from 'events';
import { join } from 'path';
import { ElectronLogger } from '../logger/electron-logger';
import { WorkerFactory } from '../worker-factory.service';

/**
 * TimerScheduler is a singleton class that manages a timer, which emits a 'tick' event every second.
 * The timer is efficiently managed and only one instance exists at a time.
 */
export class TimerScheduler extends EventEmitter implements ILoggable {
  private static instance: TimerScheduler;
  private secondsElapsed = 0;
  private worker = WorkerFactory.createWorker(
    join(__dirname, 'assets', 'workers', 'timer.worker')
  );
  public logger: ILogger = new ElectronLogger('Timer Scheduler');

  /**
   * Initializes a new instance of the TimerScheduler class.
   * Sets up event listeners for the worker to handle messages and errors.
   * The 'message' event is handled by binding the handleWorkerMessage function,
   * and the 'error' event logs the error using the logger.
   * This constructor is private to ensure that the TimerScheduler class remains a singleton.
   */
  private constructor() {
    super();
    this.worker.on('message', this.handleWorkerMessage.bind(this));
    this.worker.on('error', (error) => {
      this.logger.error('Worker error:', error);
    });
  }

  /**
   * Handles messages from the worker.
   * The message will be an object with an 'action' and 'secondsElapsed' property.
   * The 'action' property can have the following values:
   * - 'tick': The worker emits this event every second.
   * - 'stop': The worker emits this event when it is stopped.
   * - 'start': The worker emits this event when it is started.
   * The 'secondsElapsed' property is the number of seconds that have elapsed since the worker was started.
   * @param message - The message object with 'action' and 'secondsElapsed' properties.
   */
  private handleWorkerMessage({
    action,
    secondsElapsed,
    error,
  }: {
    action: string;
    secondsElapsed: number;
    error?: Error;
  }): void {
    switch (action) {
      case 'tick':
        /**
         * Emits the 'tick' event with the number of seconds elapsed since the worker was started.
         * @event TimerScheduler#tick
         * @property {number} secondsElapsed - The number of seconds that have elapsed since the worker was started.
         */
        this.secondsElapsed = secondsElapsed;
        this.emit('tick', this.secondsElapsed);
        break;
      case 'error':
      case 'stop':
        if (error) {
          this.logger.error('Worker error:', error);
        }
        /**
         * Emits the 'stop' event with the number of seconds elapsed since the worker was started.
         * @event TimerScheduler#stop
         * @property {number} secondsElapsed - The number of seconds that have elapsed since the worker was started.
         */
        this.emit('stop', this.secondsElapsed);
        this.secondsElapsed = 0; // Reset
        /**
         * Removes all listeners for the 'tick' event.
         */
        this.removeAllListeners('tick');
        /**
         * Removes all listeners for the 'start' event.
         */
        this.removeAllListeners('start');
        /**
         * Removes all listeners for the 'stop' event.
         */
        this.removeAllListeners('stop');
        break;
      case 'start':
        /**
         * Removes all listeners for the 'start' event.
         */
        this.removeAllListeners('start');
        /**
         * Emits the 'start' event.
         * @event TimerScheduler#start
         */
        this.emit('start');
        break;
      default:
        this.logger.warn('Unknown action:', action);
        break;
    }
  }

  /**
   * Returns the singleton instance of TimerScheduler.
   * Creates a new instance if it does not exist yet.
   *
   * @returns The singleton instance of TimerScheduler.
   */
  public static getInstance(): TimerScheduler {
    if (!this.instance) {
      this.instance = new TimerScheduler();
    }
    return this.instance;
  }

  /**
   * Starts the timer.
   *
   * If the timer is already running, this call has no effect.
   */
  public start(): void {
    if (this.worker) {
      /**
       * Sends a message to the worker to start the timer.
       */
      this.worker.postMessage({ action: 'start' });
    }
  }

  /**
   * Stops the timer.
   *
   * Sends a message to the worker to stop the timer if the worker is available.
   * This will result in the 'stop' event being emitted with the total seconds elapsed.
   */
  public stop(): void {
    if (this.worker) {
      /**
       * Sends a message to the worker to stop the timer.
       */
      this.worker.postMessage({ action: 'stop' });
    }
  }

  /**
   * Returns the total number of seconds that have elapsed since the timer was started.
   *
   * @returns The number of seconds elapsed.
   */
  public getSecondsElapsed(): number {
    return this.secondsElapsed;
  }

  /**
   * Registers a callback to be executed every time the 'tick' event is emitted.
   * The callback receives the total number of seconds elapsed as an argument.
   *
   * @param callback - Function that takes the total seconds elapsed as an argument.
   */
  public onTick(callback: (secondsElapsed: number) => void): void {
    this.on('tick', callback);
  }

  /**
   * Registers a callback to be executed when the 'stop' event is emitted.
   * The callback will be triggered when the timer is stopped and receives the total elapsed time.
   *
   * @param callback - Function that will be executed when the timer is stopped.
   */
  public onStop(callback: (elapsedTime: number) => void): void {
    this.on('stop', () => this.removeAllListeners('stop')); // Remove listeners for 'stop' event;
    this.on('stop', callback);
  }

  /**
   * Registers a callback to be executed when the 'start' event is emitted.
   * The callback will be triggered when the timer is started.
   *
   * @param callback - Function that will be executed when the timer is started.
   */
  public onStart(callback: () => void): void {
    this.on('start', callback);
  }
}
