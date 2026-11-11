import fs from "node:fs/promises";

const base = (process.env.PUBLIC_BASE_URL || process.env.PREVIEW_URL || "http://localhost:3118").replace(/\/$/, "");
const timeoutMs = Number(process.env.AUDIT_TIMEOUT_MS || 30000);
const expectPublic = process.env.EXPECT_PUBLIC_CANDIDATES === "1";
const source = JSON.parse(await fs.readFile(new URL("../src/data/official-site-product-candidates.json", import.meta.url), "utf8"));
const mergedIds = new Set([754923, 754921, 754926, 754931, 754932, 754918, 754919]);
const candidates = source.products.filter((candidate) => {
  const id = Number(candidate.sourceUrl.match(/\/display\/(\d+)\.html$/)?.[1]);
  return !mergedIds.has(id);
});
if (candidates.length !== 21) throw new Error(`Unexpected candidate inventory: ${candidates.length}`);

const forbiddenMarkers = ["reviewStatus", "claimsVerified", "assetStatus", "excluded-candidate", "generated-placeholder"];
const request = async (path) => {
  const started = Date.now();
  try {
    const response = await fetch(`${base}${path}`, { signal: AbortSignal.timeout(timeoutMs) });
    return { path, status: response.status, body: await response.text(), durationMs: Date.now() - started };
  } catch (error) {
    return { path, status: null, body: "", durationMs: Date.now() - started, error: error?.name ?? String(error) };
  }
};

const list = await request("/en/products");
const detailRows = [];
for (const candidate of candidates) {
  const id = candidate.sourceUrl.match(/\/display\/(\d+)\.html$/)?.[1];
  const path = `/en/products/official-${id}`;
  const result = await request(path);
  const staleName = `KOMU product · ${candidate.name}`;
  const staleIntro = `The official KOMU product center lists ${candidate.name}.`;
  detailRows.push({
    sourceId: Number(id),
    path,
    status: result.status,
    durationMs: result.durationMs,
    staleEnglishCopy: result.body.includes(staleName) || result.body.includes(staleIntro),
    forbiddenMarkers: forbiddenMarkers.filter((marker) => result.body.includes(marker)),
    error: result.error ?? null,
  });
}

const observedPublic = detailRows.filter((row) => row.status === 200).length;
const missingExpected = expectPublic ? detailRows.filter((row) => row.status !== 200).map((row) => row.path) : [];
const staleCopy = detailRows.filter((row) => row.staleEnglishCopy).map((row) => row.path);
const leakedFields = detailRows.filter((row) => row.forbiddenMarkers.length).map((row) => ({ path: row.path, markers: row.forbiddenMarkers }));
const transportErrors = [
  ...(list.status === null ? [{ path: list.path, error: list.error ?? "request failed" }] : []),
  ...detailRows.filter((row) => row.status === null).map((row) => ({ path: row.path, error: row.error ?? "request failed" })),
];
const listCandidateLinks = candidates.filter((candidate) => {
  const id = candidate.sourceUrl.match(/\/display\/(\d+)\.html$/)?.[1];
  return list.body.includes(`/en/products/official-${id}`);
}).map((candidate) => Number(candidate.sourceUrl.match(/\/display\/(\d+)\.html$/)?.[1]));
const result = {
  ok: Boolean(list.status === 200 && !transportErrors.length && !missingExpected.length && !leakedFields.length),
  status: transportErrors.length ? "UNKNOWN" : missingExpected.length || leakedFields.length ? "FAIL-SCOPED" : staleCopy.length ? "PARTIAL" : "PASS-SCOPED",
  base,
  expectPublic,
  inventory: candidates.length,
  list: { status: list.status, durationMs: list.durationMs, candidateLinks: listCandidateLinks.length, candidateSourceIds: listCandidateLinks },
  observedPublic,
  missingExpected,
  staleCopy,
  leakedFields,
  transportErrors,
  detailRows,
};
console.log(JSON.stringify(result, null, 2));
if (result.status === "FAIL-SCOPED") process.exitCode = 1;
