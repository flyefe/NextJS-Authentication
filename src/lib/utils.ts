// Utility helpers for UI components

/**
 * Combines class names, filtering out falsy values.
 * @param {...(string | undefined | null | false)[]} classes
 * @returns {string}
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
