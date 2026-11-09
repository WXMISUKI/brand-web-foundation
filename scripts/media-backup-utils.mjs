import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";

export const manifestFile = "media-manifest.json";

export function safeRelativePath(value) {
  if (typeof value !== "string" || !value || path.isAbsolute(value)) throw new Error(`Unsafe media path: ${value}`);
  const parts = value.split(/[\\/]+/);
  if (parts.some(part => part === ".." || part === "")) throw new Error(`Unsafe media path: ${value}`);
  return parts.join("/");
}

export function assertNonRootDirectory(directory) {
  const resolved = path.resolve(directory);
  if (path.parse(resolved).root === resolved) throw new Error(`Refusing to operate on a filesystem root: ${resolved}`);
  return resolved;
}

export async function listFiles(root) {
  const files = [];
  async function visit(directory) {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
      const absolute = path.join(directory, entry.name);
      if (entry.isSymbolicLink()) throw new Error(`Symbolic links are not supported in media storage: ${absolute}`);
      if (entry.isDirectory()) await visit(absolute);
      else if (entry.isFile()) files.push(absolute);
      else throw new Error(`Unsupported media filesystem entry: ${absolute}`);
    }
  }
  await visit(root);
  return files;
}

export async function sha256(filePath) {
  const hash = createHash("sha256");
  const stream = (await import("node:fs")).createReadStream(filePath);
  for await (const chunk of stream) hash.update(chunk);
  return hash.digest("hex");
}

export async function buildManifest(root) {
  const files = [];
  for (const absolute of await listFiles(root)) {
    const relative = safeRelativePath(path.relative(root, absolute));
    if (relative === manifestFile) continue;
    const stat = await fs.stat(absolute);
    files.push({ path: relative, bytes: stat.size, sha256: await sha256(absolute) });
  }
  return { schemaVersion: 1, generatedAt: new Date().toISOString(), files, totalFiles: files.length, totalBytes: files.reduce((sum, file) => sum + file.bytes, 0) };
}

export async function readManifest(directory) {
  const manifest = JSON.parse(await fs.readFile(path.join(directory, manifestFile), "utf8"));
  if (manifest.schemaVersion !== 1 || !Array.isArray(manifest.files)) throw new Error("Unsupported media manifest");
  for (const file of manifest.files) safeRelativePath(file.path);
  return manifest;
}

export async function copyManifestFiles(sourceRoot, targetRoot, manifest) {
  for (const file of manifest.files) {
    const source = path.join(sourceRoot, file.path);
    const target = path.join(targetRoot, file.path);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.copyFile(source, target);
  }
}

export async function verifyManifest(root, expected) {
  const actual = await buildManifest(root);
  const expectedFiles = [...expected.files].sort((a, b) => a.path.localeCompare(b.path));
  const actualFiles = [...actual.files].sort((a, b) => a.path.localeCompare(b.path));
  if (expectedFiles.length !== actualFiles.length) throw new Error(`Media file count mismatch: expected ${expectedFiles.length}, got ${actualFiles.length}`);
  for (let index = 0; index < expectedFiles.length; index += 1) {
    const expectedFile = expectedFiles[index], actualFile = actualFiles[index];
    if (expectedFile.path !== actualFile.path || expectedFile.bytes !== actualFile.bytes || expectedFile.sha256 !== actualFile.sha256) throw new Error(`Media manifest mismatch at ${expectedFile.path}`);
  }
  return actual;
}
