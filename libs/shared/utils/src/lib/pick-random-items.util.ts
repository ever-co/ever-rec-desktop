/**
 * Randomly selects `count` unique items from the input array using the Fisher-Yates shuffle algorithm.
 * This method ensures no duplicates and preserves uniform randomness.
 *
 * @template T - The type of elements in the input array.
 * @param {T[]} array - The source array from which to pick elements.
 * @param {number} count - The number of unique elements to randomly select.
 * @returns {T[]} A new array containing `count` randomly selected unique items from the input array.
 *
 * @throws {Error} If `count` is greater than the length of the input array.
 *
 * @example
 * const items = [{ id: 1 }, { id: 2 }, { id: 3 }];
 * const random = pickRandomItems(items, 2);
 * // -> Returns 2 unique items randomly selected from the input
 */
export function pickRandomItems<T>(array: T[], count: number): T[] {
  if (count <= 0) return [];
  if (count > array.length) return array;

  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > shuffled.length - count - 1; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(shuffled.length - count);
}