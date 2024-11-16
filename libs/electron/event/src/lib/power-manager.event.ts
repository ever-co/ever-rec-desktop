import {
  AcPowerSourceHandler,
  BatteryPowerSourceHandler,
  LockScreenHandler,
  PowerEventManager,
  ResumeHandler,
  SuspendHandler,
  TimerScheduler,
  UnlockScreenHandler,
} from '@ever-co/electron-utils';
export function powerManagerHandlerEvents(): void {
  const timerScheduler = TimerScheduler.getInstance();
  const powerEventManager = PowerEventManager.getInstance();

  timerScheduler.onStart(() => {
    console.log('Start listening to power events');

    powerEventManager.registerHandler('suspend', new SuspendHandler());
    powerEventManager.registerHandler('resume', new ResumeHandler());
    powerEventManager.registerHandler(
      'unlock-screen',
      new UnlockScreenHandler()
    );
    powerEventManager.registerHandler('lock-screen', new LockScreenHandler());
    powerEventManager.registerHandler('on-ac', new AcPowerSourceHandler());
    powerEventManager.registerHandler('on-battery', new BatteryPowerSourceHandler());

    powerEventManager.start();
  });

  timerScheduler.onStop(() => {
    powerEventManager.stop();
  });
}
