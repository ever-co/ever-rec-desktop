import { inject, Injectable } from '@angular/core';
import { sendPasswordResetEmail, updateProfile } from '@angular/fire/auth';
import { API_PREFIX, isEmpty, IUser } from '@ever-co/shared-utils';
import {
  createUserWithEmailAndPassword,
  getAuth,
  getIdTokenResult,
  GoogleAuthProvider,
  sendEmailVerification,
  signInWithPopup,
  signOut,
  User
} from 'firebase/auth';
import { HttpClient } from '@angular/common/http';
import { IProfile } from '../models/profile.model';
import { ISignUp } from '../models/sign-up.model';
import { Observable } from 'rxjs';
import { ILoginResponse } from '../models/user.model';

@Injectable()
export class AuthService {
  private readonly auth = getAuth();
  private readonly http = inject(HttpClient);
  private readonly API = `${API_PREFIX}/auth`;

  public signIn(email: string, password: string): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(`${this.API}/login`, { email, password });
  }

  public signInWithGoogle() {
    return this.http.post<ILoginResponse>(`${this.API}/login-google`, { });
  }

  public signOut() {
    return this.http.delete<void>(`${this.API}/logout`);
  }

  public checkIfUserIsSignedIn() {
    return this.http.get<IUser>(`${this.API}/user-data`);
  }

  public getRefreshToken(user: User) {
    return getIdTokenResult(user, true);
  }

  public signUp(input: ISignUp) {
    const { email, password } = input;
    return this.http.post<ILoginResponse>(`${this.API}/register`, { email, password });
  }

  public updateProfile(user: User, profile: IProfile): Observable<void> {
    const displayName = profile?.fullName;
    const photoURL = profile?.imageUrl;

    const payload = {
      ...(displayName && { displayName }),
      ...(photoURL && { photoURL })
    };

    if (isEmpty(payload)) {
      throw new Error('No payload');
    }

    return this.http.put<void>(`${this.API}/auth/user-data`, { displayName, photoURL });
  }

  public verify(oob: string): Observable<void> {
    return this.http.post<void>(`${this.API}/email/reset-password-email`, { oob });
  }

  public deleteUser(): Observable<void> {
    return this.http.delete<void>(`${this.API}/auth/user`);
  }

  public resetPassword(email: string): Observable<void> {
    return this.http.post<void>(`${this.API}/email/reset-password-email`, { email });
  }
}
