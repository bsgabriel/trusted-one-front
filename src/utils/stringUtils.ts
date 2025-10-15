/**
 * Normalizes a string, removing accents and converting to upper case
 * @param str - String to be normalized
 * @returns Normalized string without accents and in upper case
 * @example
 * normalizeString('Família') // 'familia'
 * normalizeString('José') // 'jose'
 */
export const normalizeString = (str: string): string => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
};

/**
 * Verifies if a string contains another, ignoring case and accents
 * @param str - The string to search in
 * @param search - The substring to search for
 * @returns True if str contains search (case and accent insensitive)
 * @example
 * includesNormalized('Família Silva', 'familia') // true
 * includesNormalized('José', 'jose') // true
 * includesNormalized('Ação', 'cao') // true
 */
export const includesNormalized = (str: string, search: string): boolean => {
  return normalizeString(str).includes(normalizeString(search));
};

/**
 * Compares two strings after normalizing them using locale-aware comparison.
 *
 * This function normalizes both input strings and then performs a locale-sensitive string comparison.
 *
 * @param {string} a - The first string to compare.
 * @param {string} b - The second string to compare.
 * @returns {number} A negative number if a comes before b, a positive number if a comes after b,
 *                   or 0 if the strings are equal (after normalization).
 *
 * @example
 * compareNormalized("apple", "banana"); // Returns a negative number (a comes before b)
 * compareNormalized("Café", "cafe"); // Returns 0 (strings are equal after normalization)
 *
 * // Can be used with Array.sort()
 * const words = ["zebra", "apple", "banana"];
 * words.sort(compareNormalized);
 */
export const compareNormalized = (a: string, b: string): number => {
  return normalizeString(a).localeCompare(normalizeString(b));
};
