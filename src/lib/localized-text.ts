const decodeEntities = (value: string): string => value
  .replace(/&quot;|&#34;|&#x22;/gi, '"')
  .replace(/&apos;|&#39;|&#x27;/gi, "'")
  .replace(/&amp;/gi, "&")
  .replace(/&lt;/gi, "<")
  .replace(/&gt;/gi, ">");

/** Read a Payload localized text value from either a plain string or a JSON object. */
export function localizedText(value: unknown, locale: string): string | null {
  if (typeof value === "string") {
    const trimmed = decodeEntities(value.trim());
    if (!trimmed) return null;
    if (trimmed.startsWith("{")) {
      try {
        return localizedText(JSON.parse(trimmed), locale);
      } catch {
        return trimmed;
      }
    }
    return trimmed;
  }
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const record = value as Record<string, unknown>;
    return localizedText(record[locale] ?? record.en ?? record.zh, locale);
  }
  return null;
}

/** Return an accessible public image alt without leaking a serialized locale map. */
export function publicImageAlt(value: unknown, locale: string, fallback = ""): string {
  const text = localizedText(value, locale);
  if (!text || text.startsWith("{") || text.startsWith("[")) return fallback;
  return text;
}
