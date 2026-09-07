/**
 * Shared utility library.
 * Add helpers, formatters, validators, and other reusable code here.
 */

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
