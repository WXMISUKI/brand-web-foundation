import fs from "node:fs/promises";
import path from "node:path";
import { assertNonRootDirectory, copyManifestFiles, manifestFile, readManifest, verifyManifest } from "./media-backup-utils.mjs";

if (process.env.RESTORE_MEDIA_CONFIRM !== "YES") throw new Error("Media restore is destructive. Set RESTORE_MEDIA_CONFIRM=YES to continue.");
if (!process.argv[2]) throw new Error("Usage: npm run restore:media -- path/to/media-backup [target-directory]");
const backup = assertNonRootDirectory(process.argv[2]);
const target = assertNonRootDirectory(process.argv[3] || process.env.PAYLOAD_MEDIA_DIR || ".local/media-restored");
const manifest = await readManifest(backup);
try {
  const entries = await fs.readdir(target);
  if (entries.length) {
    if (process.env.RESTORE_MEDIA_OVERWRITE !== "YES") throw new Error(`Restore target is not empty; set RESTORE_MEDIA_OVERWRITE=YES to replace it: ${target}`);
    await fs.rm(target, { recursive: true, force: true });
  }
} catch (error) {
  if (error?.code !== "ENOENT") throw error;
}
await fs.mkdir(target, { recursive: true });
await copyManifestFiles(backup, target, manifest);
await fs.copyFile(path.join(backup, manifestFile), path.join(target, manifestFile));
await verifyManifest(target, manifest);
console.log(JSON.stringify({ ok: true, input: backup, output: target, files: manifest.totalFiles, bytes: manifest.totalBytes, manifest: path.join(target, manifestFile), destructiveConfirmation: "YES" }, null, 2));
