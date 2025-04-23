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

interface MergeableObject {
  [key: string]: any;
}

export function mergeWithPriorityForEmpty(
  obj1: MergeableObject | MergeableObject[],
  obj2: MergeableObject | MergeableObject[],
  uniqueIdentifier: string
): MergeableObject[] {
  // Convert inputs to arrays if they aren't already
  const array1 = Array.isArray(obj1) ? obj1 : [obj1];
  const array2 = Array.isArray(obj2) ? obj2 : [obj2];

  // Create a map from array2 for quick lookup
  const obj2Map = new Map<any, MergeableObject>();
  array2.forEach((item: MergeableObject) => {
    obj2Map.set(item[uniqueIdentifier], item);
  });

  // Merge the arrays
  const merged = array1.map((item1: MergeableObject) => {
    const item2 = obj2Map.get(item1[uniqueIdentifier]);
    if (!item2) return item1;

    // Create a new merged object with explicit type
    const mergedItem: MergeableObject = {};

    // Get all unique keys from both objects
    const allKeys = new Set([...Object.keys(item1), ...Object.keys(item2)]);

    // For each key, prioritize empty/null values
    allKeys.forEach((key: string) => {
      if (
        item1[key] === null ||
        item1[key] === undefined ||
        item1[key] === ''
      ) {
        mergedItem[key] = item2[key];
      } else if (
        item2[key] === null ||
        item2[key] === undefined ||
        item2[key] === ''
      ) {
        mergedItem[key] = item1[key];
      } else {
        // If neither is empty, default to obj1's value
        mergedItem[key] = item1[key];
      }
    });

    return mergedItem;
  });

  // Add any items from array2 that weren't in array1
  array2.forEach((item2: MergeableObject) => {
    if (
      !merged.some(
        (m: MergeableObject) => m[uniqueIdentifier] === item2[uniqueIdentifier]
      )
    ) {
      merged.push(item2);
    }
  });

  return merged;
}
