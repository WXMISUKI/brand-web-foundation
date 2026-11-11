import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const bundleRoot = path.resolve(process.argv[2] || path.join(process.env.BACKUP_DIR || ".local/backups", `bundle-${timestamp}`));
const databaseOutput = path.join(bundleRoot, "payload.dump");
const mediaOutput = path.join(bundleRoot, "media");
const statusOutput = path.join(bundleRoot, "backup-status.json");
const databaseUrl = process.env.DATABASE_URL || "";

const redact = value => String(value || "").replaceAll(databaseUrl, databaseUrl ? "[redacted]" : "");
const run = (script, args, env) => new Promise((resolve, reject) => {
  const child = spawn(process.execPath, [path.join(root, "scripts", script), ...args], { cwd: root, env, stdio: ["ignore", "pipe", "pipe"], windowsHide: true });
  let stdout = "", stderr = "";
  child.stdout.on("data", chunk => { stdout += chunk.toString(); });
  child.stderr.on("data", chunk => { stderr += chunk.toString(); });
  child.on("error", reject);
  child.on("close", code => code === 0 ? resolve({ stdout, stderr }) : reject(new Error(redact(stderr.trim() || `${script} exited with ${code}`))));
});

if (!databaseUrl) throw new Error("DATABASE_URL is required");
if (!process.env.PAYLOAD_MEDIA_DIR) throw new Error("PAYLOAD_MEDIA_DIR is required");

await fs.mkdir(bundleRoot, { recursive: true });
const status = {
  schemaVersion: 1,
  ok: false,
  startedAt: new Date().toISOString(),
  bundleRoot,
  databaseOutput,
  mediaOutput,
  steps: [],
  error: null,
};

try {
  await run("backup-postgres.mjs", [databaseOutput], process.env);
  status.steps.push({ name: "postgres", ok: true, output: databaseOutput });
  await run("backup-media.mjs", [mediaOutput], process.env);
  status.steps.push({ name: "media", ok: true, output: mediaOutput });
  status.ok = true;
} catch (error) {
  status.error = redact(error?.message || error);
  status.steps.push({ name: status.steps.length === 0 ? "postgres" : "media", ok: false });
  process.exitCode = 1;
} finally {
  status.finishedAt = new Date().toISOString();
  await fs.writeFile(statusOutput, `${JSON.stringify(status, null, 2)}\n`, "utf8");
}

console.log(JSON.stringify({ ok: status.ok, bundleRoot, status: statusOutput, steps: status.steps, error: status.error }, null, 2));
