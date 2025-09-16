import { IBase } from "./base.interface";

export interface IUser extends IBase {
  name?: string;
  email?: string;
  imageUrl?: string;
  isVerified?: boolean;
}

export interface IUserPersistance extends IBase {
  remoteId?: string;
  email?: string;
  lastLoginAt?: string;
}
