import { EventEmitter } from 'events';

/**
 * TimerScheduler is a singleton class that manages a timer, which emits a 'tick' event every second.
 * The timer is efficiently managed and only one instance exists at a time.
 */
export class TimerScheduler extends EventEmitter {
  private static instance: TimerScheduler;
  private intervalId: NodeJS.Timeout | null = null;
  private secondsElapsed = 0;

  /**
   * Private constructor to enforce the singleton pattern.
   * Initializes the timer state.
   */
  private constructor() {
    super();
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
   * Starts the timer and begins emitting the 'tick' event every second.
   * Emits a 'start' event if the timer was successfully started.
   * If the timer is already running, this method does nothing.
   */
  public start(): void {
    if (this.intervalId !== null) return; // Prevent starting if already running

    this.emit('start'); // Emit 'start' event

    this.intervalId = setInterval(() => {
      this.secondsElapsed++;
      this.emit('tick', this.secondsElapsed); // Emit 'tick' event every second
    }, 1000);
  }

  /**
   * Stops the timer and stops emitting the 'tick' event.
   * Emits a 'stop' event if the timer was successfully stopped.
   * If the timer is not running, this method does nothing.
   */
  public stop(): void {
    if (this.intervalId === null) return; // Prevent stopping if not running

    clearInterval(this.intervalId); // Stop the interval
    this.intervalId = null; // Reset the intervalId
    const elapsedTime = this.secondsElapsed;
    this.secondsElapsed = 0; // Reset elapsed time

    this.emit('stop', elapsedTime); // Emit 'stop' event with the last elapsed time
    this.removeAllListeners('tick'); // Remove listeners for 'tick' event
    this.removeAllListeners('start'); // Remove listeners for 'start' event
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
