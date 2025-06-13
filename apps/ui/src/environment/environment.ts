import { IEnvironment } from '@ever-co/shared-utils';

export class Environment implements IEnvironment {
  public readonly canUseWebWorker = true;
  public readonly appName = 'Ever Rec';
  public readonly icon = 'fiber_smart_record';
}
