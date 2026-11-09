import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";

const databaseUrl = process.env.DATABASE_URL;
const input = process.argv[2];
if (!databaseUrl) throw new Error("DATABASE_URL is required");
if (!input) throw new Error("Usage: npm run restore:postgres -- path/to/backup.dump");
if (process.env.RESTORE_CONFIRM !== "YES") throw new Error("Restore is destructive. Set RESTORE_CONFIRM=YES to continue.");
const backup = path.resolve(input);
await fs.access(backup);

const command = process.env.PG_RESTORE_BIN || "pg_restore";
const args = ["--clean", "--if-exists", "--no-owner", "--no-privileges", "--dbname", databaseUrl, backup];
await new Promise((resolve, reject) => {
  const child = spawn(command, args, { stdio: "inherit", windowsHide: true });
  child.on("error", reject);
  child.on("close", code => code === 0 ? resolve() : reject(new Error(`pg_restore exited with ${code}`)));
});
console.log(JSON.stringify({ ok: true, input: path.relative(process.cwd(), backup), destructiveConfirmation: "YES" }, null, 2));
