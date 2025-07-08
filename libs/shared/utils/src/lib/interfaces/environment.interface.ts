import { IFirebaseConfig } from './auth.interface';

export interface IEnvironment {
  isPlugin: boolean;
  canUseWebWorker: boolean;
  appName: string;
  icon: string;
  useEmulators?: boolean;
  firebaseConfig?: IFirebaseConfig;
}
