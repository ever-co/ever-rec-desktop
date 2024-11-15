import { EventEmitter } from 'events';

/**
 * TimerScheduler is a singleton class that manages a timer which emits a 'tick' event every second.
 * It ensures only one instance of the timer is created and that the timer is managed efficiently.
 */
export class TimerScheduler extends EventEmitter {
  private static instance: TimerScheduler;
  private intervalId: NodeJS.Timeout | null = null;
  private secondsElapsed = 0;

  /**
   * Private constructor to enforce singleton pattern.
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
   * If the timer is already running, this method does nothing.
   */
  public start(): void {
    if (this.intervalId !== null) return; // Prevent starting if already running

    this.intervalId = setInterval(() => {
      this.secondsElapsed++;
      this.emit('tick', this.secondsElapsed);
    }, 1000);
  }

  /**
   * Stops the timer and stops emitting the 'tick' event.
   * If the timer is not running, this method does nothing.
   */
  public stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.secondsElapsed = 0; // Reset elapsed time when stopping the timer
      this.removeAllListeners('tick');
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
   * Removes the 'tick' event listener to prevent memory leaks.
   *
   * @param callback - The callback function to remove.
   */
  public offTick(callback: (secondsElapsed: number) => void): void {
    this.off('tick', callback);
  }
}
