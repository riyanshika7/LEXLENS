/**
 * Algorithmic Binary Search Utilities with guaranteed O(log N) runtime.
 */

export function binarySearch<T>(
  items: T[],
  target: number,
  keyExtractor: (item: T) => number
): T | null {
  let left = 0;
  let right = items.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const midVal = keyExtractor(items[mid]);

    if (midVal === target) {
      return items[mid];
    } else if (midVal < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return null;
}

export function binarySearchRange<T>(
  items: T[],
  target: number,
  keyExtractor: (item: T) => number
): T[] {
  let left = 0;
  let right = items.length;

  // Find lower bound
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (keyExtractor(items[mid]) < target) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  const start = left;

  // Find upper bound
  right = items.length;
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (keyExtractor(items[mid]) <= target) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  const end = left;

  return items.slice(start, end);
}
