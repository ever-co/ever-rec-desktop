import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_PREFIX, IFile, isEmpty } from '@ever-co/shared-utils';
import { catchError, EMPTY, Observable } from 'rxjs';
import { IDataResponse } from '../models/auth.model';
import { IProfile } from '../models/profile.model';
import { ISignUp } from '../models/sign-up.model';
import {
  ILoginResponse,
  IRefreshToken,
  IUserResponse,
} from '../models/user.model';

@Injectable()
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly API = `${API_PREFIX}/auth`;

  public signIn(email: string, password: string): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(`${this.API}/login`, {
      email,
      password,
    });
  }

  public signInWithGoogle(credentials: string) {
    return this.http.post<ILoginResponse>(`${this.API}/login-google`, {
      credentials,
    });
  }

  public signOut() {
    return this.http.get<void>(`${this.API}/logout`);
  }

  public checkIfUserIsSignedIn() {
    return this.http
      .get<IUserResponse>(`${this.API}/user-data`)
      .pipe(catchError(() => EMPTY));
  }

  public getRefreshToken() {
    return this.http.get<IRefreshToken>(`${this.API}/refresh-token`);
  }

  public signUp(input: ISignUp) {
    const { email, password, fullName } = input;
    return this.http.post<ILoginResponse>(`${this.API}/register`, {
      email,
      password,
      username: fullName,
    });
  }

  public updateProfile(profile: IProfile) {
    const displayName = profile?.fullName;
    const photoURL = profile?.imageUrl;

    const payload = {
      ...(displayName && { displayName }),
      ...(photoURL && { photoURL }),
    };

    if (isEmpty(payload)) {
      throw new Error('No payload');
    }

    return this.http.put<IDataResponse<{ displayName: string; email: string }>>(
      `${this.API}/user-data`,
      {
        displayName,
        photoURL,
      },
    );
  }

  public generateEmailVerificationLink(email: string) {
    return this.http.post<IDataResponse<{ link: string }>>(
      `${this.API}/generate-email-verification-link`,
      { email },
    );
  }

  public sendEmailVerificationLink(idToken: string | null) {
    return this.http.post<IDataResponse>(
      `${this.API}/send-email-verification`,
      { idToken },
    );
  }

  public deleteAccount(): Observable<IDataResponse> {
    return this.http.delete<IDataResponse>(`${this.API}/user`);
  }

  public resetPassword(email: string): Observable<IDataResponse> {
    return this.http.post<IDataResponse>(
      `${this.API}/send-password-reset-email`,
      {
        email,
      },
    );
  }

  public updateEmail(email: string): Observable<IDataResponse> {
    return this.http.put<IDataResponse<{ email: string }>>(
      `${this.API}/email`,
      {
        email,
      },
    );
  }

  public updatePassword(data: {
    email: string;
    password: string;
    oldPassword: string;
  }): Observable<IDataResponse> {
    return this.http.put<IDataResponse<{ email: string }>>(
      `${this.API}/password`,
      data,
    );
  }

  public verifyEmail(): Observable<IDataResponse<boolean>> {
    return this.http.get<IDataResponse<boolean>>(`${this.API}/verify-email`);
  }

  public reauthenticate(data: { email: string; password: string }) {
    return this.http.post<IDataResponse<IRefreshToken>>(
      `${this.API}/reauthenticate`,
      data,
    );
  }

  public uploadAvatar(file: IFile) {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<IDataResponse<{ photoURL: string }>>(
      `${this.API}/upload-avatar`,
      form,
    );
  }
}
