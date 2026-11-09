import fs from "node:fs/promises";
import path from "node:path";
import { assertNonRootDirectory, buildManifest, copyManifestFiles, manifestFile, verifyManifest } from "./media-backup-utils.mjs";

const source = assertNonRootDirectory(process.env.PAYLOAD_MEDIA_DIR || ".local/media");
const target = assertNonRootDirectory(process.argv[2] || path.join(process.env.BACKUP_DIR || ".local/backups", `media-${new Date().toISOString().replace(/[:.]/g, "-")}`));
if (source === target) throw new Error("Media backup target must be different from PAYLOAD_MEDIA_DIR.");
await fs.access(source);
try {
  const entries = await fs.readdir(target);
  if (entries.length) throw new Error(`Backup target is not empty: ${target}`);
} catch (error) {
  if (error?.code !== "ENOENT") throw error;
}
await fs.mkdir(target, { recursive: true });
const manifest = await buildManifest(source);
await copyManifestFiles(source, target, manifest);
await fs.writeFile(path.join(target, manifestFile), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
await verifyManifest(target, manifest);
console.log(JSON.stringify({ ok: true, source, output: target, files: manifest.totalFiles, bytes: manifest.totalBytes, manifest: path.join(target, manifestFile) }, null, 2));
