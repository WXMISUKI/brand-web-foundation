import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required");

const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const output = path.resolve(process.argv[2] || path.join(process.env.BACKUP_DIR || ".local/backups", `payload-${timestamp}.dump`));
await fs.mkdir(path.dirname(output), { recursive: true });

const command = process.env.PG_DUMP_BIN || "pg_dump";
const args = ["--format=custom", "--no-owner", "--no-privileges", "--file", output, databaseUrl];
const exitCode = await new Promise((resolve, reject) => {
  const child = spawn(command, args, { stdio: ["ignore", "ignore", "pipe"], windowsHide: true });
  let errorText = "";
  child.stderr.on("data", chunk => { errorText += chunk.toString(); });
  child.on("error", reject);
  child.on("close", code => code === 0 ? resolve(0) : reject(new Error(errorText.trim() || `pg_dump exited with ${code}`)));
});

const stat = await fs.stat(output);
console.log(JSON.stringify({ ok: exitCode === 0, output: path.relative(process.cwd(), output), bytes: stat.size, format: "custom" }, null, 2));
