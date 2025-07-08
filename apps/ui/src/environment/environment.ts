import { IEnvironment, IFirebaseConfig } from '@ever-co/shared-utils';

export class Environment implements IEnvironment {
  public readonly isPlugin: boolean = false;
  public readonly canUseWebWorker: boolean = true;
  public readonly appName: string = 'Ever Rec';
  public readonly icon: string = 'fiber_smart_record';
  public readonly useEmulators: boolean = true;
  public readonly firebaseConfig: IFirebaseConfig = {
    projectId: 'ever-rec-c8ff7',
    appId: '1:331856596503:web:4f17676526fd1080991652',
    apiKey: 'AIzaSyB8-x_d30k6h5jSCTZUgQW5ilbgeoHMdXk',
    authDomain: 'rec-so.firebaseapp.com',
    storageBucket: 'rec-so.appspot.com',
    messagingSenderId: '331856596503',
    measurementId: 'G-VZ5EGDZ8V7',
  };
}
