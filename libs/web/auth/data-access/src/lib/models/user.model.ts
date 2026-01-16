import { ICredentials } from './login.model';
import { IDataResponse } from './auth.model';
import { IUser } from '@ever-co/shared-utils';

export interface IRefreshToken {
  token: string;
  refreshToken: string;
  expiresAt: string;
}

export interface IntegrationStatus {
  isIntegrated: boolean;
  email: string | null;
}

export interface IUserResponse {
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
  expiresAt: string;
}

export interface ILoginSuccess extends IRefreshToken {
  user: IUser;
}

export interface ILoginResponse extends IDataResponse<IUserResponse> {}

export interface ILoginCredentials {
  credentials: ICredentials;
  rememberMe: boolean;
}

export interface IUserReload {
  disabled: boolean;
  email: string;
  emailVerified: boolean;
  metadata: {
    lastSignInTime: string;
    creationTime: string;
  };
  creationTime: string;
  lastSignInTime: string;
  providerData: {
    uid: string;
    email: string;
    providerId: string;
  }[];
  tokensValidAfterTime: string;
  uid: string;
}

export class UserMapper {
  public static fromReponseToUser(user: IUserResponse): IUser {
    return {
      id: user.id,
      name: user.displayName,
      email: user.email,
      imageUrl: user.photoURL ?? '',
      isVerified: user.isVerified,
    };
  }
}
