export const defaultLocale = 'pt-BR' as const;

export const locales = ['pt-BR', 'en'] as const;

export type Locale = (typeof locales)[number];

export function isValidLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
