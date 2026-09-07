import { describe, it, expect } from 'vitest';
import { defaultLocale, locales, isValidLocale } from './config';

describe('i18n config', () => {
  it('default locale is pt-BR', () => {
    expect(defaultLocale).toBe('pt-BR');
  });

  it('locales are pt-BR and en', () => {
    expect(locales).toEqual(['pt-BR', 'en']);
  });

  it('pt-BR is valid', () => {
    expect(isValidLocale('pt-BR')).toBe(true);
  });

  it('en is valid', () => {
    expect(isValidLocale('en')).toBe(true);
  });

  it('zh is NOT valid', () => {
    expect(isValidLocale('zh')).toBe(false);
  });

  it('random string is not valid', () => {
    expect(isValidLocale('xyz')).toBe(false);
  });
});
