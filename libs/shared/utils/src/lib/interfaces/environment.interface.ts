export interface IEnvironment {
  isPlugin: boolean;
  canUseWebWorker: boolean;
  appName: string;
  icon: string;
  apiUrl?: string;
  google?: {
    clientId: string;
    redirectUri: string;
  };
}
