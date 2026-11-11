import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const script = path.join(root, "scripts", "prepare-standalone.mjs");

const run = (cwd, args) => new Promise((resolve, reject) => {
  const child = spawn(process.execPath, [script, ...args], { cwd, stdio: ["ignore", "pipe", "pipe"] });
  let stdout = "";
  let stderr = "";
  child.stdout.on("data", chunk => { stdout += chunk; });
  child.stderr.on("data", chunk => { stderr += chunk; });
  child.once("error", reject);
  child.once("close", code => resolve({ code, stdout, stderr }));
});

test("prepare-standalone rejects Sharp resolved from the project root", async () => {
  const temp = await fs.mkdtemp(path.join(os.tmpdir(), "haifa-standalone-boundary-"));
  try {
    await fs.mkdir(path.join(temp, ".next", "standalone"), { recursive: true });
    await fs.mkdir(path.join(temp, ".next", "static"), { recursive: true });
    await fs.mkdir(path.join(temp, "public"), { recursive: true });
    await fs.mkdir(path.join(temp, "node_modules", "sharp"), { recursive: true });
    await fs.writeFile(path.join(temp, ".next", "standalone", "server.js"), "module.exports = {};\n");
    await fs.writeFile(path.join(temp, "public", "favicon.svg"), "<svg/>\n");
    await fs.writeFile(path.join(temp, "node_modules", "sharp", "package.json"), JSON.stringify({ name: "sharp", version: "test" }));
    await fs.writeFile(path.join(temp, "node_modules", "sharp", "index.js"), "module.exports = {};\n");

    const result = await run(temp, [".next"]);
    assert.notEqual(result.code, 0);
    assert.match(`${result.stdout}\n${result.stderr}`, /outside standalone node_modules/);
  } finally {
    await fs.rm(temp, { recursive: true, force: true });
  }
});
