import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

if (process.env.BOOTSTRAP_CONFIRM !== "YES") throw new Error("Admin bootstrap is write-enabled. Set BOOTSTRAP_CONFIRM=YES to continue.");
const email = String(process.env.BOOTSTRAP_EMAIL || "").trim().toLowerCase();
const password = String(process.env.BOOTSTRAP_PASSWORD || "");
const name = String(process.env.BOOTSTRAP_NAME || "Site administrator").trim();
if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("BOOTSTRAP_EMAIL must be a valid email address.");
if (password.length < 16) throw new Error("BOOTSTRAP_PASSWORD must contain at least 16 characters.");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.env.NODE_ENV = process.env.NODE_ENV || "production";
const require = createRequire(import.meta.url);
const nextEnv = require("@next/env");
if (!nextEnv.default) nextEnv.default = nextEnv;
const { getPayload } = await import("payload");
const config = (await import(pathToFileURL(path.join(root, "src", "payload.config.ts")).href)).default;
const payload = await getPayload({ config });

try {
  const existing = await payload.find({ collection: "users", pagination: false, limit: 1, overrideAccess: true });
  if (existing.totalDocs > 0) throw new Error("The users collection is not empty; use an existing admin instead of bootstrapping another one.");
  const user = await payload.create({ collection: "users", data: { email, password, name }, overrideAccess: true });
  console.log(JSON.stringify({ ok: true, userId: user.id, email, passwordStored: true }, null, 2));
} finally {
  if (payload?.destroy) await payload.destroy();
}
