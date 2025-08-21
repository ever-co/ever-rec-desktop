import { IEnvironment } from '@ever-co/shared-utils';

export class Environment implements IEnvironment {
  public readonly isPlugin: boolean = false;
  public readonly canUseWebWorker: boolean = true;
  public readonly appName: string = 'Ever Rec';
  public readonly icon: string = 'fiber_smart_record';
  public readonly useEmulators: boolean = true;
  public readonly apiUrl: string = 'http://localhost:3000';
  public readonly google = {
    redirectUri: 'http://localhost:4200/authorize',
    clientId:
      '331856596503-27e2jg0qi44bu0thotgg36gds735ue5s.apps.googleusercontent.com',
  };
}
