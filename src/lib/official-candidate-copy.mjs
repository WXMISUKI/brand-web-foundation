const canonicalReferences = new Map([[569688, 569687], [569692, 569693]]);

export function candidateEnglishCopy(candidate) {
  const match = /^http:\/\/m\.zgkomu\.cn\/display\/(\d+)\.html$/.exec(candidate.sourceUrl);
  if (!match) throw new Error("Invalid official candidate source URL");
  const sourceId = Number(match[1]);
  const reference = canonicalReferences.get(sourceId) ?? sourceId;
  const category = candidate.name.includes("水溶肥") ? "water-soluble fertilizer" : candidate.name.includes("复合肥") ? "compound fertilizer" : candidate.name.includes("肥料") || candidate.name.includes("菌肥") ? "fertilizer" : "product";
  return {
    name: `KOMU ${category} · source reference ${reference}`,
    intro: "This product is listed in the official KOMU product center. Contact us for current product information.",
  };
}

// Only replace the exact historical generated values; independently preserve staff edits.
export function candidateCopyRepair(candidate, current) {
  const replacement = candidateEnglishCopy(candidate);
  const oldName = `KOMU product · ${candidate.name}`;
  const oldIntro = `The official KOMU product center lists ${candidate.name}. Model, packaging, technical values and claims remain subject to formal review.`;
  return {
    ...(current.name === oldName ? { name: replacement.name } : {}),
    ...(current.intro === oldIntro ? { intro: replacement.intro } : {}),
  };
}

export function candidateMediaAltRepair(candidate, current) {
  const expected = JSON.stringify({ en: `KOMU product · ${candidate.name}`, zh: candidate.name });
  return current === expected ? candidateEnglishCopy(candidate).name : null;
}

// A preview only: callers must still guard the old values atomically when writing.
export function planCandidateCopyRepairs(candidates, records) {
  return candidates.map(candidate => {
    candidateEnglishCopy(candidate); // validate the source before deriving a slug
    const id = /\/(\d+)\.html$/.exec(candidate.sourceUrl)[1];
    const slug = `official-${id}`;
    const matches = records.filter(record => record.slug === slug);
    if (!matches.length) return { slug, status: "missing" };
    if (matches.length !== 1) return { slug, status: "conflict" };
    const record = matches[0];
    if (record.sourceUrl !== candidate.sourceUrl || record.reviewStatus !== "owner-review" || record.claimsVerified !== false) return { slug, status: "conflict" };
    const changes = candidateCopyRepair(candidate, record);
    return { slug, id: record.id, status: Object.keys(changes).length ? "change" : "preserved", changes };
  });
}
