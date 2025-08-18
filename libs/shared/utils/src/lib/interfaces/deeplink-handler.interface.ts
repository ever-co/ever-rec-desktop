/**
 * @file
 *
 * This is the interface for a deep link handler.
 * It's a key part of the Open/Closed Principle implementation.
 */
export interface IDeepLinkHandler {
  /**
   * Checks if this handler can process the given URL.
   * @param url The URL to check.
   */
  canHandle(url: URL): boolean;

  /**
   * Processes the given URL.
   * @param url The URL to handle.
   */
  handle(url: URL): void;
}
