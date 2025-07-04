import { IUser, Cloneable } from '@ever-co/shared-utils';
import { User } from 'firebase/auth';
import { ICredentials } from './login.model';

export interface ILoginResponse {
  user: IUser;
  token: string;
  expiresIn: number;
}

export interface ILoginCredentials {
  credentials: ICredentials;
  rememberMe: boolean;
}

export class UserAdapter implements IUser, Cloneable<IUser> {
  private _id!: string;
  private _email!: string;
  private _imageUrl!: string;
  private _name!: string;
  private _isVerified!: boolean;
  private _isAnonymous!: boolean;

  constructor(firebase: User) {
    this._id = firebase.uid;
    this._email = firebase.email ?? '';
    this._imageUrl = firebase.photoURL ?? '';
    this._name = firebase.displayName ?? '';
    this._isVerified = firebase.emailVerified;
    this._isAnonymous = firebase.isAnonymous;
  }

  public get id(): string {
    return this._id;
  }

  public get email(): string {
    return this._email;
  }

  public get imageUrl(): string {
    return this._imageUrl;
  }

  public get name(): string {
    return this._name;
  }

  public get isVerified(): boolean {
    return this._isVerified;
  }

  public get isAnonymous(): boolean {
    return this._isAnonymous;
  }

  public clone(): IUser {
    return {
      id: this.id,
      email: this.email,
      imageUrl: this.imageUrl,
      name: this.name,
      isVerified: this.isVerified,
      isAnonymous: this.isAnonymous,
    };
  }
}
