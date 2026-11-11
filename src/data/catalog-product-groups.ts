export const catalogProductGroups = [
  { canonicalSlug: "official-569687", aliasSlugs: ["official-569688"] },
  { canonicalSlug: "official-569693", aliasSlugs: ["official-569692"] },
] as const;

const aliasToCanonical = new Map<string, string>(
  catalogProductGroups.flatMap(({ canonicalSlug, aliasSlugs }) => aliasSlugs.map(aliasSlug => [aliasSlug, canonicalSlug] as const)),
);

const aliasesByCanonical = new Map<string, string[]>(catalogProductGroups.map(({ canonicalSlug, aliasSlugs }) => [canonicalSlug, [...aliasSlugs]]));

export type ProductSourceMedia = { src: string; alt: string | null; sourceUrl: string | null };

export function canonicalProductSlug(slug: string): string {
  return aliasToCanonical.get(slug) ?? slug;
}

export function productAliasSlugs(slug: string): string[] {
  return aliasesByCanonical.get(canonicalProductSlug(slug)) ?? [];
}

export const publicProductAliasSlugs = catalogProductGroups.flatMap(group => [...group.aliasSlugs]);

export function uniqueSourceMedia(media: ProductSourceMedia[]): ProductSourceMedia[] {
  const seen = new Set<string>();
  return media.filter(item => {
    if (seen.has(item.src)) return false;
    seen.add(item.src);
    return true;
  });
}
