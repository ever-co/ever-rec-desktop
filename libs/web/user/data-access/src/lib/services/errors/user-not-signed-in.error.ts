/**
 * Custom error class for when a user is not signed in but an authenticated operation is attempted.
 */
export class UserNotSignedInError extends Error {
  constructor(
    message: string = 'No user is currently signed in. Please sign in to perform this action.',
  ) {
    super(message);
    this.name = 'UserNotSignedInError';
  }
}
