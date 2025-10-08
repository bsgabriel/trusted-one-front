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
