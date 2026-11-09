/** Keep owner-review wording useful to buyers without asserting unverified claims. */
export function publicProductIntro(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed
    .replace(/Formula and claims await review\.?/gi, "Formula and claims are available from the KOMU team on request.")
    .replace(/Specifications await review\.?/gi, "Current specifications are available from the KOMU team on request.");
}
