export function isEmpty<T>(obj: T): boolean {
  for (const key in obj) {
    if (obj[key] !== null && obj[key] !== undefined) {
      return false;
    }
  }
  return true;
}
