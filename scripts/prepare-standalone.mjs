import fs from "node:fs/promises";
import path from "node:path";

const inputRoot = process.argv[2] ?? ".next";
const outputRoot = path.resolve(process.cwd(), inputRoot);
const standaloneRoot = path.join(outputRoot, "standalone");
const sourceStatic = path.join(outputRoot, "static");
const sourcePublic = path.resolve(process.cwd(), "public");
const targetStatic = path.join(standaloneRoot, ".next", "static");
const targetPublic = path.join(standaloneRoot, "public");

const checks = [];

const statPath = async (candidate, kind) => {
  const stats = await fs.stat(candidate);
  if (kind === "directory" && !stats.isDirectory()) throw new Error(`Expected directory: ${candidate}`);
  if (kind === "file" && !stats.isFile()) throw new Error(`Expected file: ${candidate}`);
};

const countFiles = async directory => {
  let count = 0;
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) count += await countFiles(entryPath);
    else if (entry.isFile()) count += 1;
  }
  return count;
};

const check = async (name, candidate, kind) => {
  await statPath(candidate, kind);
  checks.push({ name, path: path.relative(process.cwd(), candidate) || "." });
};

try {
  await check("standalone server", path.join(standaloneRoot, "server.js"), "file");
  await check("source static directory", sourceStatic, "directory");
  await check("source public directory", sourcePublic, "directory");
  await check("source favicon", path.join(sourcePublic, "favicon.svg"), "file");

  await fs.cp(sourceStatic, targetStatic, { recursive: true, force: true, errorOnExist: false });
  await fs.cp(sourcePublic, targetPublic, { recursive: true, force: true, errorOnExist: false });

  await check("standalone static directory", targetStatic, "directory");
  await check("standalone public directory", targetPublic, "directory");
  await check("standalone favicon", path.join(targetPublic, "favicon.svg"), "file");

  const result = {
    ok: true,
    outputRoot: path.relative(process.cwd(), outputRoot) || ".",
    standaloneRoot: path.relative(process.cwd(), standaloneRoot) || ".",
    copied: {
      staticFiles: await countFiles(targetStatic),
      publicFiles: await countFiles(targetPublic),
    },
    checks,
  };
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  console.error(JSON.stringify({ ok: false, error: error instanceof Error ? error.message : String(error), checks }, null, 2));
  process.exitCode = 1;
}
