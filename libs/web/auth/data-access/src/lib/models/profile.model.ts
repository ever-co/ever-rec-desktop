import { ISignUp } from './sign-up.model';

export interface IProfile extends Partial<ISignUp> {
  imageUrl?: string;
}
