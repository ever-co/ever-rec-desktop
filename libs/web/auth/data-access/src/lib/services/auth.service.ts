import { Injectable } from '@angular/core';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
  getIdTokenResult,
} from 'firebase/auth';

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
}
