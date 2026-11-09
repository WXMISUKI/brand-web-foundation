import path from "node:path";
import { pathToFileURL } from "node:url";

const migrationName = process.argv[2];
if (!migrationName || !/^[a-z0-9][a-z0-9_-]*$/i.test(migrationName)) throw new Error("Usage: npm run migration:create -- migration_name");
if (process.env.PAYLOAD_DATABASE !== "postgres") throw new Error("Migration generation requires PAYLOAD_DATABASE=postgres.");
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required for migration generation.");
if (!process.env.PAYLOAD_SECRET || process.env.PAYLOAD_SECRET.length < 32) throw new Error("PAYLOAD_SECRET must contain at least 32 characters.");

const root = process.cwd();
const { migrate } = await import(pathToFileURL(path.resolve(root, "node_modules", "payload", "dist", "bin", "migrate.js")).href);
const config = (await import(pathToFileURL(path.resolve(root, "src", "payload.config.ts")).href)).default;
await migrate({
  config,
  migrationDir: path.resolve(root, "src", "migrations"),
  parsedArgs: { _: ["migrate:create", migrationName], forceAcceptWarning: process.env.MIGRATION_FORCE === "YES", skipEmpty: true },
});
