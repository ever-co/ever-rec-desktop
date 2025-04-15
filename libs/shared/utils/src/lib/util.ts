/**
 * Checks whether all properties of the given object are either `null` or `undefined`.
 *
 * @template T - The type of the object to check.
 * @param obj - The object to evaluate.
 * @returns `true` if all properties are `null` or `undefined`, otherwise `false`.
 *
 * @example
 * isEmpty({ a: null, b: undefined }); // true
 * isEmpty({ a: 0, b: null });         // false
 */
export function isEmpty<T>(obj: T): boolean {
  for (const key in obj) {
    if (obj[key] !== null && obj[key] !== undefined) {
      return false;
    }
  }
  return true;
}

/**
 * Converts a base64-encoded image string (with optional data URI prefix)
 * into a Node.js Buffer.
 *
 * @param base64String - The base64 string representing an image,
 * optionally prefixed with a data URI (e.g., "data:image/png;base64,").
 * @returns A Buffer containing the binary image data.
 *
 * @throws Will throw an error if the input is not a valid base64 string.
 */
export function convertBase64ToBuffer(base64String: string): Buffer {
  if (typeof base64String !== 'string') {
    throw new TypeError('Input must be a base64-encoded string.');
  }

  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');

  return Buffer.from(base64Data, 'base64');
}

/**
 * Checks if the given URL is an HTTP or HTTPS URL.
 *
 * @param url - The URL to check.
 * @returns `true` if the URL is an HTTP or HTTPS URL, otherwise `false`.
 */
export function isHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}
