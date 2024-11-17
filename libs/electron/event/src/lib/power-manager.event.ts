import {
  LockScreenHandler,
  PowerEventManager,
  TimerScheduler,
  UnlockScreenHandler
} from '@ever-co/electron-utils';
/**
 * Registers the power manager event handlers.
 * This function registers the power manager event handlers on the TimerScheduler's start event.
 * The event handlers are registered with the PowerEventManager.
 * When the TimerScheduler is stopped, the PowerEventManager is stopped as well.
 */
export function powerManagerHandlerEvents(): void {
  const timerScheduler = TimerScheduler.getInstance();
  const powerEventManager = PowerEventManager.getInstance();

  timerScheduler.onStart(() => {
    // Register the unlock-screen and lock-screen event handlers.
    powerEventManager.registerHandler(
      'unlock-screen',
      new UnlockScreenHandler()
    );
    powerEventManager.registerHandler('lock-screen', new LockScreenHandler());

    // Start the PowerEventManager.
    powerEventManager.start();
  });

  timerScheduler.onStop(() => {
    // Stop the PowerEventManager when the TimerScheduler is stopped.
    powerEventManager.stop();
  });
}
