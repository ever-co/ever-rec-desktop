import { Injectable } from '@angular/core';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
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
}
