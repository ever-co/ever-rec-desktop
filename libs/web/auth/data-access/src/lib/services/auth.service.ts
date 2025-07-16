import { Injectable } from '@angular/core';
import { updateProfile } from '@angular/fire/auth';
import { isEmpty } from '@ever-co/shared-utils';
import {
  createUserWithEmailAndPassword,
  getAuth,
  getIdTokenResult,
  GoogleAuthProvider,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
} from 'firebase/auth';
import { IProfile } from '../models/profile.model';
import { ISignUp } from '../models/sign-up.model';

@Injectable()
export class AuthService {
  private readonly auth = getAuth();

  public signIn(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  public signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider);
  }

  public signOut() {
    return signOut(this.auth);
  }

  public checkIfUserIsSignedIn() {
    return this.auth.currentUser;
  }

  public getRefreshToken(user: User) {
    return getIdTokenResult(user, true);
  }

  public signUp(input: ISignUp) {
    const { email, password } = input;
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  public updateProfile(user: User, profile: IProfile): Promise<void> {
    const displayName = profile?.fullName;
    const photoURL = profile?.imageUrl;

    const payload = {
      ...(displayName && { displayName }),
      ...(photoURL && { photoURL }),
    };

    if (isEmpty(payload)) {
      throw new Error('No payload');
    }

    return updateProfile(user, payload);
  }

  public verify(user: User): Promise<void> {
    return sendEmailVerification(user);
  }

  public deleteUser(user: User): Promise<void> {
    return user.delete();
  }
}
