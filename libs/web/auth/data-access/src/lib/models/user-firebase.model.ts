interface IUserFirebase {
  /**
   * The user's unique ID.
   * This is a stable identifier for the user within your Firebase project.
   */
  uid: string;

  /**
   * The user's email address.
   * Null if the user signed in anonymously or with a phone number,
   * or if the email was not provided by the identity provider.
   */
  email: string | null;

  /**
   * The user's display name.
   * Null if not provided by the identity provider or not set.
   */
  displayName: string | null;

  /**
   * The user's profile picture URL.
   * Null if not provided by the identity provider or not set.
   */
  photoURL: string | null;

  /**
   * Whether the user's email address is verified.
   * True if verified, false otherwise.
   */
  emailVerified: boolean;

  /**
   * The user's phone number.
   * Null if the user signed in with an email/password or other method
   * that does not provide a phone number.
   */
  phoneNumber: string | null;

  /**
   * Indicates if the user is anonymous.
   * True if signed in anonymously, false otherwise.
   */
  isAnonymous: boolean;

  /**
   * The ID of the provider that the user signed in with.
   * This is typically "firebase" for Firebase Auth, but it's more helpful to
   * look at `providerData` for specific login methods.
   */
  providerId: string;
}
