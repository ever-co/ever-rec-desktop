import { IFirebaseConfig } from './auth.interface';

export interface IEnvironment {
  isPlugin: boolean;
  canUseWebWorker: boolean;
  appName: string;
  icon: string;
  apiUrl?: string;
  useEmulators?: boolean;
  firebaseConfig?: IFirebaseConfig;
}
