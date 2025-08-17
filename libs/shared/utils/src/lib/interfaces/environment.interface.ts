export interface IEnvironment {
  isPlugin: boolean;
  canUseWebWorker: boolean;
  appName: string;
  icon: string;
  googleClientId?: string;
  apiUrl?: string;
}
