/**
 * Custom error class for when a security-sensitive operation requires a recent login,
 * but no current password (or other credential) is provided for reauthentication.
 */
export class CurrentPasswordRequiredError extends Error {
  constructor(
    message: string = 'Your current password is required to verify your identity for this security-sensitive operation.',
  ) {
    super(message);
    this.name = 'CurrentPasswordRequiredError';
  }
}
