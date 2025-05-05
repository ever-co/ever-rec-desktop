import { IEnvironment } from '@ever-co/shared-utils';

export class Environment implements IEnvironment {
  public readonly canUseWebWorker = true;
}
