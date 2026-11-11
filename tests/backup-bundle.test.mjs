import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const script = path.join(root, "scripts", "backup-bundle.mjs");
const run = (args, env) => new Promise(resolve => {
  const child = spawn(process.execPath, [script, ...args], { cwd: root, env, stdio: ["ignore", "pipe", "pipe"], windowsHide: true });
  let stdout = "", stderr = "";
  child.stdout.on("data", chunk => { stdout += chunk.toString(); });
  child.stderr.on("data", chunk => { stderr += chunk.toString(); });
  child.on("close", code => resolve({ code, stdout, stderr }));
});

async function fixture() {
  const temp = await fs.mkdtemp(path.join(os.tmpdir(), "haifa-backup-bundle-"));
  const media = path.join(temp, "media");
  const fakeDump = path.join(temp, "fake-pg-dump.mjs");
  const fakeCommand = path.join(temp, "fake-pg-dump.cmd");
  await fs.mkdir(media, { recursive: true });
  await fs.writeFile(path.join(media, "sample.txt"), "sample-media\n");
  await fs.writeFile(fakeDump, `import fs from "node:fs/promises";\nif (process.env.FAKE_BACKUP_FAILURE === "1") process.exit(7);\nconst output = process.argv[process.argv.indexOf("--file") + 1];\nawait fs.writeFile(output, "fake-dump");\n`);
  await fs.writeFile(fakeCommand, `@echo off\nnode "${fakeDump}" %*\n`);
  return { temp, media, fakeCommand };
}

test("backup bundle succeeds atomically and writes status plus media manifest", async () => {
  const { temp, media, fakeCommand } = await fixture();
  try {
    const bundle = path.join(temp, "bundle");
    const result = await run([bundle], { ...process.env, DATABASE_URL: "postgresql://secret-user:secret-pass@example.invalid/db", PAYLOAD_MEDIA_DIR: media, PG_DUMP_BIN: fakeCommand });
    assert.equal(result.code, 0, `${result.stderr}\n${result.stdout}`);
    const status = JSON.parse(await fs.readFile(path.join(bundle, "backup-status.json"), "utf8"));
    assert.equal(status.ok, true);
    assert.equal(status.steps.length, 2);
    assert.equal(status.steps[0].name, "postgres");
    assert.equal(status.steps[1].name, "media");
    assert.match(await fs.readFile(path.join(bundle, "media", "media-manifest.json"), "utf8"), /sample\.txt/);
    assert.equal(await fs.readFile(path.join(bundle, "payload.dump"), "utf8"), "fake-dump");
    assert.doesNotMatch(await fs.readFile(path.join(bundle, "backup-status.json"), "utf8"), /secret-pass/);
  } finally {
    await fs.rm(temp, { recursive: true, force: true });
  }
});

test("backup bundle records failure and exits nonzero without exposing the database URL", async () => {
  const { temp, media, fakeCommand } = await fixture();
  try {
    const bundle = path.join(temp, "bundle-failure");
    const result = await run([bundle], { ...process.env, DATABASE_URL: "postgresql://secret-user:secret-pass@example.invalid/db", PAYLOAD_MEDIA_DIR: media, PG_DUMP_BIN: fakeCommand, FAKE_BACKUP_FAILURE: "1" });
    assert.notEqual(result.code, 0);
    const status = JSON.parse(await fs.readFile(path.join(bundle, "backup-status.json"), "utf8"));
    assert.equal(status.ok, false);
    assert.equal(status.steps.length, 1);
    assert.equal(status.steps[0].ok, false);
    assert.doesNotMatch(JSON.stringify(status), /secret-pass/);
  } finally {
    await fs.rm(temp, { recursive: true, force: true });
  }
});
