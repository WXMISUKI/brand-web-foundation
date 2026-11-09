import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tempRoot = path.join(root, ".local", "flbook-payload-dry-run");
await fs.rm(tempRoot, { recursive: true, force: true });
const reportPath = path.join(root, ".local", "flbook-payload-dry-run-report.json");
try {
  const report = JSON.parse(await fs.readFile(reportPath, "utf8"));
  report.cleanupPending = false;
  await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
} catch {
  // A missing report is harmless when this helper is used independently.
}
console.log(JSON.stringify({ ok: true, cleaned: path.relative(root, tempRoot) }, null, 2));
