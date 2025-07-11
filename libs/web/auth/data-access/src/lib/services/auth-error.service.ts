import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthErrorService {
  public getFirebase(error: any): string {
    if (!error || !error.code) return 'An unknown error occurred';
    switch (error.code) {
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/user-disabled':
        return 'This account has been disabled';
      case 'auth/user-not-found':
        return 'No account found with this email';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/email-already-in-use':
        return 'This email is already in use';
      case 'auth/operation-not-allowed':
        return 'This operation is not allowed';
      case 'auth/weak-password':
        return 'Password is too weak';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later';
      case 'auth/account-exists-with-different-credential':
        return 'An account already exists with the same email but different sign-in credentials';
      case 'auth/popup-closed-by-user':
        return 'The sign-in popup was closed before completing the process';
      case 'auth/network-request-failed':
        return 'Network error occurred. Please check your internet connection';
      case 'auth/requires-recent-login':
        return 'This operation requires recent authentication. Please log in again';
      default:
        return 'Authentication failed. Please try again';
    }
  }
}
