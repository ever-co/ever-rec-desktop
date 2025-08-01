import { Injectable } from '@angular/core';
import { AuthErrorService, AuthService } from '@ever-co/auth-data-access';
import {
  AuthError,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
  User,
} from 'firebase/auth';
import { CurrentPasswordRequiredError } from './errors/current-password-required.error';
import { UserNotSignedInError } from './errors/user-not-signed-in.error';

@Injectable({
  providedIn: 'root',
})
export class EmailUpdateService {
  constructor(
    private readonly authService: AuthService,
    private readonly authErrorService: AuthErrorService,
  ) {}

  /**
   * Reauthenticates the given user with an email and password credential.
   * This is a crucial step for security-sensitive operations.
   *
   * @param user The Firebase User object to reauthenticate.
   * @param currentPassword The user's current password.
   * @throws Error if the user's email is not available, or if reauthentication fails.
   */
  private async reauthenticateUser(
    user: User,
    currentPassword: string,
  ): Promise<void> {
    if (!user.email) {
      // If for some reason the user object doesn't have an email, we can't create the credential.
      throw new Error(
        'User email is missing, cannot perform reauthentication. Please try signing in again.',
      );
    }

    // Creating an EmailAuthCredential is the way to tell Firebase you're re-verifying the user.
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword,
    );

    try {
      // This is the core Firebase Auth method for reauthenticating.
      await reauthenticateWithCredential(user, credential);
      console.log('User successfully reauthenticated.');
    } catch (reauthError) {
      // Catch specific reauthentication errors and re-throw with clearer messages.
      const authErr = reauthError as AuthError;
      console.error('Reauthentication failed:', authErr.code, authErr.message);

      const errorMessage = this.authErrorService.getFirebase(authErr);

      throw new Error(errorMessage);
    }
  }

  /**
   * Updates the user's email address. This is a security-sensitive operation,
   * meaning it requires a recent login. If the login isn't recent, the user
   * will need to reauthenticate.
   *
   * @param newEmail The new email address for the user.
   * @param currentPassword Optional: The user's current password. Required if reauthentication is needed.
   * @returns A Promise that resolves when the email is successfully updated.
   * @throws UserNotSignedInError if no user is currently signed in.
   * @throws CurrentPasswordRequiredError if reauthentication is needed but no password is provided.
   * @throws Error for other Firebase Auth errors (e.g., invalid email, email already in use).
   */
  // public async updateUserEmail(
  //   newEmail: string,
  //   currentPassword?: string,
  // ): Promise<void> {
  //   // First, let's make sure we actually have a user signed in.
  //   // Assuming `authService.checkIfUserIsSignedIn()` returns a Firebase `User` object or `null`.
  //   const user = this.authService.checkIfUserIsSignedIn();
  //   if (!user) {
  //     throw new UserNotSignedInError();
  //   }
  //
  //   try {
  //     // Attempt the email update directly. Firebase will tell us if a recent login is required.
  //     await updateEmail(user, newEmail);
  //     console.log(
  //       'Email updated successfully without requiring reauthentication.',
  //     );
  //   } catch (error) {
  //     // If an error occurs, let's figure out what kind of error it is.
  //     await this.handleEmailUpdateError(
  //       error as AuthError,
  //       user,
  //       newEmail,
  //       currentPassword,
  //     );
  //   }
  // }

  /**
   * Internal method to handle specific Firebase Auth errors that might occur
   * during an email update operation.
   *
   * @param error The Firebase AuthError that occurred.
   * @param user The current Firebase User.
   * @param newEmail The email address the user tried to change to.
   * @param currentPassword Optional: The current password provided by the user.
   * @throws CurrentPasswordRequiredError if 'auth/requires-recent-login' and no password is given.
   * @throws Error for other handled Auth errors (e.g., invalid email, email already in use)
   *              or if reauthentication fails.
   */
  private async handleEmailUpdateError(
    error: AuthError,
    user: User,
    newEmail: string,
    currentPassword?: string,
  ): Promise<void> {
    switch (error.code) {
      case 'auth/requires-recent-login':
        console.warn(
          'Email update is a security-sensitive operation and requires a recent login. Attempting reauthentication...',
        );
        if (!currentPassword) {
          // If the user hasn't provided their current password, we can't reauthenticate.
          throw new CurrentPasswordRequiredError();
        }
        // If we have a password, proceed with reauthentication and then retry the email update.
        await this.reauthenticateAndRetryEmailUpdate(
          user,
          newEmail,
          currentPassword,
        );
        break;

      case 'auth/invalid-email':
        throw new Error(
          'The new email address you provided is invalid. Please check the format and try again.',
        );

      case 'auth/email-already-in-use':
        throw new Error(
          'The email address you entered is already associated with another account. Please use a different email or sign in with that account.',
        );

      case 'auth/network-request-failed':
        throw new Error(
          'A network error occurred. Please check your internet connection and try again.',
        );

      // Add more specific error handling here if needed for other AuthError codes.
      default:
        // For any other unexpected errors, log them and throw a generic message.
        console.error(
          'An unhandled Firebase Auth error occurred during email update:',
          error.code,
          error.message,
        );
        throw new Error(
          `An unexpected error occurred: ${error.message}. Please try again later.`,
        );
    }
  }

  /**
   * Reauthenticates the user and then retries the email update operation.
   * This method is called specifically when `auth/requires-recent-login` error occurs.
   *
   * @param user The Firebase User object.
   * @param newEmail The new email address.
   * @param currentPassword The user's current password.
   * @returns A Promise that resolves when reauthentication and subsequent email update are successful.
   * @throws Error if reauthentication fails or the second email update attempt fails.
   */
  private async reauthenticateAndRetryEmailUpdate(
    user: User,
    newEmail: string,
    currentPassword: string,
  ): Promise<void> {
    try {
      // First, reauthenticate the user with the provided current password.
      await this.reauthenticateUser(user, currentPassword);
      console.log('Reauthentication successful. Retrying email update...');

      // If reauthentication succeeded, we can now confidently retry the email update.
      await updateEmail(user, newEmail);
      console.log('Email updated successfully after reauthentication!');
    } catch (error) {
      // If anything goes wrong during reauthentication or the second update attempt,
      // re-throw the error so the calling component can handle it.
      throw error;
    }
  }
}
