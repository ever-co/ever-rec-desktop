/**
 * Checks if a value is empty based on its type:
 * - For objects: checks if it's null, undefined, or has no properties
 * - For arrays: checks if it's empty
 * - For strings: checks if it's empty or contains only whitespace
 * - For numbers: returns false (numbers are never considered empty)
 * - For booleans: returns false (booleans are never considered empty)
 * - For null/undefined: returns true
 *
 * @template T - The type of the value to check
 * @param value - The value to evaluate
 * @returns `true` if the value is considered empty, otherwise `false`
 *
 * @example
 * isEmpty(null);                    // true
 * isEmpty(undefined);               // true
 * isEmpty("");                      // true
 * isEmpty("   ");                   // true
 * isEmpty({});                      // true
 * isEmpty([]);                      // true
 * isEmpty({ a: null, b: undefined }); // true
 * isEmpty({ a: 0 });                // false
 * isEmpty([null]);                  // false
 * isEmpty(0);                       // false
 * isEmpty(false);                   // false
 */
export function isEmpty<T>(value: T): boolean {
  // Handle null and undefined
  if (value === null || value === undefined) {
    return true;
  }

  // Handle strings
  if (typeof value === 'string') {
    return value.trim() === '';
  }

  // Handle arrays
  if (Array.isArray(value)) {
    return value.length === 0;
  }

  // Handle objects (but not arrays or null which are already checked)
  if (typeof value === 'object') {
    // Check if all properties are null or undefined
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        const prop = value[key];
        if (prop !== null && prop !== undefined) {
          return false;
        }
      }
    }

    // If no properties or all properties are null/undefined
    return true;
  }

  // Numbers, booleans, functions, etc. are never empty
  return false;
}

/**
 * A stricter version that only considers an object empty if it has no properties.
 * This doesn't consider { a: null } to be empty.
 *
 * @template T - The type of the object to check
 * @param value - The value to evaluate
 * @returns `true` if the value has no properties or is null/undefined
 */
export function isObjectEmpty<T>(value: T): boolean {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === 'object' && !Array.isArray(value)) {
    return Object.keys(value).length === 0;
  }

  return false;
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

/**
 * Converts a Blob object to a Buffer.
 *
 * @param blob - The Blob object to convert.
 * @returns A Promise that resolves to a Buffer containing the contents of the Blob.
 */
export async function blobToBuffer(blob: Blob): Promise<Buffer> {
  const arrayBuffer = await blobToBufferArray(blob);
  return Buffer.from(arrayBuffer);
}

/**
 * Converts a Blob object to an ArrayBuffer.
 *
 * @param blob - The Blob object to convert.
 * @returns A Promise that resolves to an ArrayBuffer containing the contents of the Blob.
 */
export async function blobToBufferArray(blob: Blob): Promise<ArrayBuffer> {
  return blob.arrayBuffer();
}

/**
 * Compares two objects for deep equality.
 *
 * @param a - The first object to compare.
 * @param b - The second object to compare.
 * @returns `true` if the objects are equal, `false` otherwise.
 */
export function deepCompare<T>(a: T, b: T): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
