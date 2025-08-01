import { ICredentials } from './login.model';
import { IDataResponse } from './auth.model';

export interface IRefreshToken {
  token: string;
  refreshToken: string;
  expiresAt: string;
}

export interface IntegrationStatus {
  isIntegrated: boolean;
  email: string | null;
}

export interface IUser {
  id: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  idToken: string;
  refreshToken: string;
  isSlackIntegrate: boolean;
  isVerified: boolean;
  dropbox: IntegrationStatus;
  jira: IntegrationStatus;
  trello: IntegrationStatus;
}

export interface ILoginSuccess extends IRefreshToken {
  user: IUser;
}

export interface ILoginResponse extends IDataResponse<IUser> {
};

export interface ILoginCredentials {
  credentials: ICredentials;
  rememberMe: boolean;
}
