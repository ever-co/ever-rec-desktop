import {
  LockScreenHandler,
  PowerEventManager,
  TimerScheduler,
  UnlockScreenHandler
} from '@ever-co/electron-utils';
export function powerManagerHandlerEvents(): void {
  const timerScheduler = TimerScheduler.getInstance();
  const powerEventManager = PowerEventManager.getInstance();

  timerScheduler.onStart(() => {
    powerEventManager.registerHandler(
      'unlock-screen',
      new UnlockScreenHandler()
    );
    powerEventManager.registerHandler('lock-screen', new LockScreenHandler());

    powerEventManager.start();
  });

  timerScheduler.onStop(() => {
    powerEventManager.stop();
  });
}
