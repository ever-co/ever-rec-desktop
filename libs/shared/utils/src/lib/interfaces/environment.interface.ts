import { IFirebaseConfig } from './auth.interface';

export interface IEnvironment {
  canUseWebWorker: boolean;
  appName: string;
  icon: string;
  useEmulators?: boolean;
  firebaseConfig?: IFirebaseConfig;
}
